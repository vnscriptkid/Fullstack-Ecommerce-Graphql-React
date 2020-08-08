import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import StripeCheckout from 'react-stripe-checkout';
import CurrentUser from './CurrentUser';
import { STRIPE_KEY } from '../config';
import calcTotalPrice from '../lib/calcTotalPrice';
import totalCartItems from '../lib/totalCartItems';
import Router from 'next/router';
import Nprogress from 'nprogress';

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION(
        $stripeToken: String!
    ) {
        createOrder(
            stripeToken: $stripeToken
        ) {
            id
        }
    }
`;

class TakeMoney extends Component {

    onToken = async ({stripe, createOrder}) => {
        Nprogress.start();
        try {
            const res = await createOrder({
                variables: {
                    stripeToken: stripe.id
                }
            });
            Router.push({
                pathname: '/order',
                query: { id: res.data.createOrder.id }
            })
        } catch (e) {
            alert(e.message);
        }
    }
    
    render() {
        return (
            <Mutation mutation={CREATE_ORDER_MUTATION}>
                {(createOrder) => (
                    <CurrentUser>
                        {({ data: { me } }) => (
                                <StripeCheckout
                                    amount={calcTotalPrice(me.cart)}
                                    name="Sick Fits"
                                    description={`Order of ${totalCartItems(me.cart)} items`}
                                    stripeKey={STRIPE_KEY}
                                    currency="USD"
                                    token={stripe => this.onToken({stripe, createOrder})}
                                    email={me.email}
                                >
                                    {this.props.children}
                                </StripeCheckout>
                            )
                        }
                    </CurrentUser>
                )}
            </Mutation>
        );
    }
}

export default TakeMoney;