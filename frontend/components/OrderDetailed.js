import React from 'react';
import PropTypes from 'prop-types';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import OrderStyles from './styles/OrderStyles';
import Head from 'next/head';
import { format } from 'date-fns';
import formatMoney from '../lib/formatMoney';

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY(
        $id: ID!
    ) {
        order(
            id: $id
        ) {
            id
            total
            charge
            createdAt
            user {
                id
            }
            items {
                id
                title
                description
                price
                image
                quantity
            }
        }
    }
`;

const OrderDetailed = ({ orderId }) => {
    return (
        <Query query={SINGLE_ORDER_QUERY} variables={{ id: orderId }}>
            {({data, error, loading}) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>{error.message}</p>
                if (!data.order) return null;
                const {charge, createdAt, items, user, total} = data.order;
                return (
                    <OrderStyles>
                        <Head>
                            <title>SickFits - Order {orderId}</title>
                        </Head>
                        <p>
                            <span>Order ID </span>
                            <span>{orderId}</span>
                        </p>
                        <p>
                            <span>Charge </span>
                            <span>{charge}</span>
                        </p>
                        <p>
                            <span>Created At </span>
                            <span>{format(new Date(createdAt), 'MMMM d, yyyy h:mm a')}</span>
                        </p>
                        <p>
                            <span>Total </span>
                            <span>{formatMoney(total)}</span>
                        </p>
                        <p>
                            <span>Item Count </span>
                            <span>{items.length}</span>
                        </p>
                        <div className="items">
                            {items.map((orderItem) => (
                                <div className="order-item" key={orderItem.id}>
                                    <img src={orderItem.image} alt={orderItem.title}/>
                                    <div className="item-details">
                                        <h2>{orderItem.title}</h2>
                                        <p>Qty: {orderItem.quantity}</p>
                                        <p>Each: {formatMoney(orderItem.price)}</p>
                                        <p>SubTotal: {formatMoney(orderItem.price * orderItem.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </OrderStyles>
                )
            }}            
        </Query>
    );
};

OrderDetailed.propTypes = {
    orderId: PropTypes.string.isRequired
}

export default OrderDetailed;