import React from 'react';
import ItemDetail from '../components/ItemDetail';

const Item = (props) => {
    return (
        <div>
            <ItemDetail id={props.query.id}/>
        </div>
    );
};

export default Item;