const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutation = {
    async createItem(parent, args, ctx, info) {
        // TODO: check if user are logged in

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
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
        const where = { id: args.id };

        // find the item with id
        const item = await ctx.db.query.item({ where }, `{ id title }`);

        if (!item) return null;

        // check if item belongs to current user
        // TODO

        // delete item
        return await ctx.db.mutation.deleteItem({ where }, info);
    },

    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();

        const hashedPassword = await bcrypt.hash(args.password, 10);

        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password: hashedPassword,
                permissions: { set: ['USER'] }
            }
        }, info);

        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week cookie
        });

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

        // gen jwt
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        // attach cookie
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week cookie
        });

        // return user
        return user;
    }
};

module.exports = Mutation;