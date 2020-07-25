const Mutation = {
    async createItem(parent, args, ctx, info) {
        // TODO: check if user are logged in

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    }
};

module.exports = Mutation;