const { forwardTo } = require('prisma-binding');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),

    async me(parent, args, ctx, info) {
        const userId = ctx.request.userId;

        if (!userId) {
            return null;
        }
        // user(where: UserWhereUniqueInput!): User
        return ctx.db.query.user(
            { 
                where: { id: userId } 
            }, 
            info
        );
    }   
    
    // async items(parent, args, ctx, info) {
    //     const items = await ctx.db.query.items()
    //     return items;
    // }
};

module.exports = Query;