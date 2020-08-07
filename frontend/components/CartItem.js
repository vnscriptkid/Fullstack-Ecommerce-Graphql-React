import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import RemoveCartItem from './RemoveCartItem';

const CartItemStyles = styled.li`
    padding: 1rem 0;
    border-bottom: 1px solid ${props => props.theme.lightGrey};
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    img {
        margin-right: 10px;
    }
    h3,
    p {
        margin: 0;
    }
`;

const CartItem = ({ cartItem: { item, quantity, id } }) => {
    if (!item) return <CartItemStyles>
        <p>This item has been deleted</p>
        <RemoveCartItem cartItemId={id}/>
    </CartItemStyles>
    return (
        <CartItemStyles>
            <img width="100" src={item.image} alt={item.image}/>
            <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p>
                    {formatMoney(item.price * quantity)}
                    {' - '}
                    {quantity} &times; {formatMoney(item.price)}
                    {' each'}
                </p>
            </div>
            <RemoveCartItem cartItemId={id}/>
        </CartItemStyles>
    );
};

CartItem.propTypes = {
    cartItem: PropTypes.object.isRequired
}

export default CartItem;