import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { GET_CURRENT_USER } from './CurrentUser';

const ADD_TO_CART = gql`
    mutation ADD_TO_CART(
        $itemId: ID!
    ) {
        addToCart(itemId: $itemId) {
            id
            quantity
        }
    }
`;

class AddToCart extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired
    }

    handleAddToCart = async (addToCart) => {
        try {
            await addToCart();
        } catch (err) {
            alert(err.message);
        }
    } 
    
    render() {
        return (
            <Mutation mutation={ADD_TO_CART} variables={{ itemId: this.props.id }} refetchQueries={[{ query: GET_CURRENT_USER }]}>
                {(addToCart, {loading}) => (
                    <button disabled={loading} onClick={() => this.handleAddToCart(addToCart)}>Add To Cart</button>
                )}
            </Mutation>
        );
    }
}

export default AddToCart;