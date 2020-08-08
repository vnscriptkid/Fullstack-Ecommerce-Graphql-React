import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import OrderItemStyles from './styles/OrderItemStyles';
import Link from 'next/link';
import totalCartItems from '../lib/totalCartItems';
import { format } from 'date-fns';
import formatMoney from '../lib/formatMoney';

const ORDER_LIST_QUERY = gql`
    query ORDER_LIST_QUERY {
        orders {
            id
            total
            createdAt
            items {
                id
                title
                price
                quantity
            }
        }
    }
`;

const OrderList = () => {
    return (
        <Query query={ORDER_LIST_QUERY}>
            {({ data, error, loading }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>{error.message}</p>
                if (!data.orders) return null;
                return (
                    <div>
                        {data.orders.map((order, index) => (
                            <OrderItemStyles key={order.id}>
                                <Link href={{ pathname: '/order', query: { id: order.id } }}>
                                    <a>
                                        <div className="order-meta">
                                            <p>#{index + 1}</p>
                                            <p>{format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}</p>
                                            <p>{totalCartItems(order.items)} Items</p>
                                            <p>{order.items.length} Products</p>
                                            <p>{formatMoney(order.total)}</p>
                                        </div>
                                    </a>
                                </Link>
                            </OrderItemStyles>
                        ))}
                    </div>
                )
            }}
        </Query>
    );
};

export default OrderList;