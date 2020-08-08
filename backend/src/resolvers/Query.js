const { forwardTo } = require('prisma-binding');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { hasAnyOfPermissionsThrowError, hasAnyOfPermissions } = require('../utils');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),

    async me(parent, args, ctx, info) {
        const userId = ctx.request.userId;

        if (!userId) {
            return null;
        }

        return ctx.db.query.user(
            { 
                where: { id: userId } 
            }, 
            info
        );
    },

    async users(parent, args, ctx, info) {
        const { userId, user } = ctx.request;
        // check if user logged in
        if (!userId) {
            throw new Error('You must be logged in');
        }

        // check if user has needed permissions
        hasAnyOfPermissionsThrowError(user, ['ADMIN', 'PERMISSIONUPDATE'])

        // return users list
        return ctx.db.query.users({}, info);
    },

    async order(parent, args, ctx, info) {
        // check if user logged in
        const {userId, user} = ctx.request;
        if (!userId) {
            throw new Error('You must be logged in');
        }
        // find the order by id
        const order = await ctx.db.query.order({
            where: { id: args.id },
        }, info);

        if (!order) {
            throw new Error('Order not found');
        }

        // check permission to see order
        const isAdmin = hasAnyOfPermissions(user, ['ADMIN']);
        const ownsOrder = order.user.id === userId;
        console.log(order.user.id, userId);

        if (!isAdmin && !ownsOrder) {
            throw new Error('You are not allowed to see the order')
        }
        
        // return order
        return order;
    },

    async orders(parent, args, ctx, info) {
        // check if user is logged in
        const {userId} = ctx.request;
        if (!userId) {
            throw new Error('You must be logged in first');
        }
        // find order list by user
        const orders = await ctx.db.query.orders({
            where: {
                user: { id: userId }
            }
        }, info);
        // return
        return orders;
    }
};

module.exports = Query;