import React, {Component} from 'react';
import styled from 'styled-components';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import { GET_CURRENT_USER } from './CurrentUser';
import PropTypes from 'prop-types';

const REMOVE_CART_ITEM = gql`
    mutation REMOVE_CART_ITEM(
        $cartItemId: ID!
    ) {
        removeFromCart(
            cartItemId: $cartItemId
        ) {
            id
        }
    }
`;

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    &:hover {
        color: ${props => props.theme.red};
        cursor: pointer;
    }
`;

class RemoveCartItem extends Component {

    static propTypes = {
        cartItemId: PropTypes.string.isRequired
    }

    afterSuccessfulDelete = (cache, payload) => {
        // read data from cache
        const _data = cache.readQuery({ query: GET_CURRENT_USER });
        const data = JSON.parse(JSON.stringify(_data));
        // fitler the deleted one from data
        const deletedCartItemId = payload.data.removeFromCart.id;
        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== deletedCartItemId);
        // write new data to cache
        cache.writeQuery({ query: GET_CURRENT_USER, data })
    }
    
    render() {
        return (
            <Mutation 
                mutation={REMOVE_CART_ITEM} 
                variables={{ cartItemId: this.props.cartItemId }} 
                update={this.afterSuccessfulDelete}
                optimisticResponse={{
                    __typename: 'Mutation',
                    removeFromCart: {
                        __typename: 'CartItem',
                        id: this.props.cartItemId
                    }
                }}
            >
                {(removeFromCart, { loading, error }) => {
                    return (
                        <BigButton disabled={loading} onClick={() => {
                            removeFromCart().catch(err => alert(err.message));
                        }}>&times;</BigButton>
                    )
                }}
            </Mutation>
        );
    }
}

export default RemoveCartItem;