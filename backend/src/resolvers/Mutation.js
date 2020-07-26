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
    }
};

module.exports = Mutation;