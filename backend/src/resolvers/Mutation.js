const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const {promisify} = require('util');
const { transport, createResetPasswordMail } = require('../mail');
const { hasAnyOfPermissionsThrowError, calcTotalPrice } = require('../utils');
const db = require('../db');
const stripe = require('../stripe');

function addTokenToCookie({ ctx, userId }) {
    // create jwt token
    const token = jwt.sign({ userId }, process.env.APP_SECRET);

    // attach cookie
    ctx.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week cookie
    });
}

const Mutation = {
    async createItem(parent, args, ctx, info) {
        // TODO: check if user are logged in
        const userId = ctx.request.userId;
        if (!userId) {
            throw new Error('You must be logged in to do that');
        }

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info);

        return item;
    },

    async updateItem(parent, args, ctx, info) {
        const {id, ...rest} = args;
        
        const item = await ctx.db.mutation.updateItem({
            data: rest, 
            where: { id }
        }, info);

        return item;
    },

    async deleteItem(parent, args, ctx, info) {
        // check if user logged in
        const {userId, user: currentUser} = ctx.request; 
        if (!userId) {
            throw new Error('You must be logged in');
        }
        
        const where = { id: args.id };

        // find the item with id
        const item = await ctx.db.query.item({ where }, `{ id title user { id } }`);

        if (!item) return null;

        // check if item belongs to current user
        const ownItem = item.user.id === ctx.request.userId;
        hasAnyOfPermissionsThrowError(currentUser, ['ADMIN', 'ITEMDELETE'])
        const hasNeededPermission = true;
        const canDelete = ownItem || hasNeededPermission;
        if (!canDelete) {
            throw new Error('You are not allowed');
        }

        // delete item
        return await ctx.db.mutation.deleteItem({ where }, info);
    },

    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();

        const hashedPassword = await bcrypt.hash(args.password, parseInt(process.env.SALT));

        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password: hashedPassword,
                permissions: { set: ['USER'] }
            }
        }, info);

        addTokenToCookie({ ctx, userId: user.id });

        return user;        
    },

    async signin(parent, args, ctx, info) {
        // find user
        const { email, password } = args;
        const user = await ctx.db.query.user({
            where: { email }
        });

        if (!user) {
            throw new Error('Email does not exist');
        }

        // check password
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            throw new Error('Invalid password');
        }

        addTokenToCookie({ ctx, userId: user.id });

        // return user
        return user;
    },

    async signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return { message: 'Logged out' }
    },

    async requestReset(parent, args, ctx, info) {
        // find the email
        const {email} = args;
        const user = await ctx.db.query.user({
            where: { email }
        });

        if (!user) {
            throw new Error('Email not found');
        }
        
        // create a random string, expire date
        const randomBytesPromisified = promisify(randomBytes);
        const resetToken = (await randomBytesPromisified(20)).toString('hex');;
        const resetTokenExpire = Date.now() + parseFloat(process.env.RESET_TOKEN_EXPIRE_AFTER); // 1 hour

        // save to the user 
        await ctx.db.mutation.updateUser({
            where: { email },
            data: { resetToken, resetTokenExpire }
        });
        
        // send email
        await transport.sendMail({
            from: 'vnscriptkid@gmail.com',
            to: email,
            subject: 'Reset password',
            html: createResetPasswordMail(`${process.env.FRONTEND_URL}/reset?token=${resetToken}`)
        });
        
        return { message: 'Successful Request' }
    },

    async resetPassword(parent, args, ctx, info) {
        const { password, confirmPassword, resetToken } = args;

        // check passwords
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // find user by token and within time
        const [user] = await ctx.db.query.users({
            where: {
                resetToken,
                resetTokenExpire_gte: Date.now()
            }
        });

        if (!user) {
            throw new Error('Invalid token');
        }

        // update password, remove resetToken
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
        
        await ctx.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpire: null
            }
        });

        addTokenToCookie({ ctx, userId: user.id });

        // return user
        return user;
    },

    async updatePermissions(parent, args, ctx, info) {
        const { userId: userIdToUpdate, permissions } = args;
        const { userId: currentUserId, user } = ctx.request;

        if (!currentUserId) {
            throw new Error('You must be logged in');
        }

        hasAnyOfPermissionsThrowError(user, ['ADMIN', 'PERMISSIONUPDATE'])

        // update
        return ctx.db.mutation.updateUser(
            {
                where: { id: userIdToUpdate },
                data: {
                    permissions: {
                        set: permissions
                    }
                }
            },
            info
        );
    },

    async addToCart(parent, args, ctx, info) {
        // check if user is signed in
        const { userId } = ctx.request;
        if (!userId) {
            throw new Error('You must be logged in first');
        }
        // find cartItem 
        const [existingCartItem] = await ctx.db.query.cartItems({
            where: {
                user: { id: userId },
                item: { id: args.itemId }
            }
        });
              
        // check if the new item is in cart
        if (existingCartItem) {
            // increase quantity by one
            return ctx.db.mutation.updateCartItem({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + 1 }
            });
        } 
        // add new
        return ctx.db.mutation.createCartItem({
            data: {
                user: { connect: { id: userId } },
                item: { connect: { id: args.itemId } }
            }
        }, info);
    },

    async removeFromCart(parent, args, ctx, info) {
        // make sure logged in
        const { userId } = ctx.request;
        const { cartItemId } = args;
        if (!userId) {
            throw new Error('You must be logged in first');
        }

        // check if current user owns the cart item
        const [foundCartItem] = await ctx.db.query.cartItems({
            where: {
                user: { id: userId },
                id: cartItemId
            }
        });

        if (!foundCartItem) {
            throw new Error('You do not own this cart item');
        }

        // delete cart item by id
        return ctx.db.mutation.deleteCartItem({
            where: { id: cartItemId }
        }, info);
    },

    async createOrder(parent, args, ctx, info) {
        // check if logged in
        const {userId} = ctx.request;
        if (!userId) {
            throw new Error('You must be logged in first');
        }

        const user = await ctx.db.query.user(
            { where: {id: userId } },
            `
                {
                    id,
                    name,
                    email,
                    cart {
                        id
                        quantity
                        item { id title description price image largeImage }
                    }
                }
            `
        )

        // recalculate total
        const amount = calcTotalPrice(user.cart);

        // charge money
        const charge = await stripe.charges.create({
            amount,
            currency: 'USD',
            source: args.stripeToken
        })

        // create order items
        const orderItems = user.cart
            .filter(cartItem => !!cartItem.item)
            .map(cartItem => {
                const orderItem = {
                    ...cartItem.item,
                    quantity: cartItem.quantity,
                    user: { connect: { id: userId } }
                }
                delete orderItem.id;
                return orderItem;
            });

        // create order
        const order = await ctx.db.mutation.createOrder({
            data: {
                total: amount,
                charge: charge.id,
                items: { create: orderItems },
                user: { connect: { id: userId } }
            }
        });
        console.log(order);

        // clean up cart
        const cartItemIds = user.cart.map(cartItem => cartItem.id);
        await ctx.db.mutation.deleteManyCartItems({
            where: { id_in: cartItemIds }
        })
        
        // return order
        return order;
    }
};

module.exports = Mutation;