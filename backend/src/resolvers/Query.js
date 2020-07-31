const { forwardTo } = require('prisma-binding');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { hasAnyOfPermissions } = require('../utils');

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
        hasAnyOfPermissions(user, ['ADMIN', 'PERMISSIONUPDATE'])

        // return users list
        return ctx.db.query.users({}, info);
    }
};

module.exports = Query;