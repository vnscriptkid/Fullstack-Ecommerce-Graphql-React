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
    }
};

module.exports = Mutation;