import React from 'react';
import OrderDetailed from '../components/OrderDetailed';

const SingleOrderPage = (props) => {
    return (
        <div>
            <OrderDetailed orderId={props.query.id}/>
        </div>
    );
};

export default SingleOrderPage;