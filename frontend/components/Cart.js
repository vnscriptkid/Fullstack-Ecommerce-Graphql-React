import React from 'react';
import CloseButton from './styles/CloseButton';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';
import {Query, Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import { GET_CURRENT_USER } from './CurrentUser';
import CartItem from './CartItem';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import {adopt} from 'react-adopt';

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

const Composed = adopt({
    user: ({ render }) => <Query query={GET_CURRENT_USER}>{render}</Query>,
    toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_OPEN_STATE}>{render}</Mutation>,
    cartOpenState: ({ render }) => <Query query={GET_CART_OPEN_STATE}>{render}</Query>
});

const Cart = () => {
    return (
        <Composed>
            {({ user, toggleCart, cartOpenState }) => {
                const { me } = user.data || {};
                const { cartOpen } = cartOpenState.data || {};
                if (!me) return null;
                return (
                    <CartStyles open={cartOpen}>
                        <header>
                            <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
                            <Supreme>{me.name}'s Cart</Supreme>
                            <p>You have {me.cart.length} Item{me.cart.length === 1 ? '' : 's'} in your cart</p>
                        </header>
                        
                        <ul>
                            {me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem}/> )}
                        </ul>

                        <footer>
                            <p>{ formatMoney(calcTotalPrice(me.cart))} </p>
                            <SickButton>Checkout</SickButton>
                        </footer>
                    </CartStyles>
                );
            }}
        </Composed>
    );
};

export default Cart;
export { TOGGLE_CART_OPEN_STATE, GET_CART_OPEN_STATE }