import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_SINGLE_ITEM = gql`
    mutation DELETE_SINGLE_ITEM(
        $id: ID!
    ) {
        deleteItem(id: $id) {
            id
        }
    }
`;

const DeleteItem = ({ children, id }) => {
    
    const updateItemList = (cache, payload) => {
        // const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
        // console.log('data: ', data);

        // const newData = { ...data, items: data.items.filter(({ id }) => id !== payload.data.deleteItem.id) };
        // console.log('newData', newData);

        // cache.writeQuery({ query: ALL_ITEMS_QUERY, data: newData });
    }
    
    return (
        <Mutation mutation={DELETE_SINGLE_ITEM} variables={{ id }} update={updateItemList}>
            {(deleteItem, { error }) => (
                <button onClick={() => {
                    if (confirm('Are you sure you want to delete this')) {
                        deleteItem().catch(err => {
                            alert(err.message);
                        });
                    }
                }}>{children}</button>
            )}
        </Mutation>
    );
};

export default DeleteItem;