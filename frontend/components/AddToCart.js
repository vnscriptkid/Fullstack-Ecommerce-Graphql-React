import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
        const res = await addToCart();
        console.log(res);
    } 
    
    render() {
        return (
            <Mutation mutation={ADD_TO_CART} variables={{ itemId: this.props.id }}>
                {(addToCart) => (
                    <button onClick={() => this.handleAddToCart(addToCart)}>Add To Cart</button>
                )}
            </Mutation>
        );
    }
}

export default AddToCart;