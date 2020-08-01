import React from 'react';
import CloseButton from './styles/CloseButton';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';
import {Query, Mutation} from 'react-apollo';
import gql from 'graphql-tag';

const GET_CART_OPEN_STATE = gql`
    query {
        cartOpen @client
    }
`;

const TOGGLE_CART_OPEN_STATE = gql`
    mutation {
        toggleCart @client
    }
`;

const Cart = () => {
    return (
        <Mutation mutation={TOGGLE_CART_OPEN_STATE}>
            {(toggleCart) => (
                <Query query={GET_CART_OPEN_STATE}>
                    {({ data: { cartOpen } }) => (
                        <CartStyles open={cartOpen}>
                            <header>
                                <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
                                <Supreme>Your Cart</Supreme>
                                <p>You have __ Items in your cart</p>
                            </header>

                            <footer>
                                <p>$10.10</p>
                                <SickButton>Checkout</SickButton>
                            </footer>
                        </CartStyles>
                    )}
                </Query>
            )}
        </Mutation>
    );
};

export default Cart;
export { TOGGLE_CART_OPEN_STATE, GET_CART_OPEN_STATE }