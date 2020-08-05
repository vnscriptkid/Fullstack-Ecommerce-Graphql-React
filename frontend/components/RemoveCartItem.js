import React from 'react';
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

const RemoveCartItem = ({ cartItemId }) => {
    return (
        <Mutation mutation={REMOVE_CART_ITEM} variables={{ cartItemId }} refetchQueries={[{ query: GET_CURRENT_USER }]}>
            {(removeFromCart, { loading, error }) => {
                return (
                    <BigButton disabled={loading} onClick={() => {
                        removeFromCart().catch(err => alert(err.message));
                    }}>&times;</BigButton>
                )
            }}
        </Mutation>
    );
};

RemoveCartItem.propTypes = {
    cartItemId: PropTypes.string.isRequired
}

export default RemoveCartItem;