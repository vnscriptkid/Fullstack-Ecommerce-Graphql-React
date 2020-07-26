import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import Link from 'next/link';

class Item extends Component {
    static propTypes = {
        item: PropTypes.object.isRequired
    }
    
    render() {
        const {item} = this.props;
        return (
            <ItemStyles>
                {item.image && <img href={item.image} alt={item.title}/>}
                <Title>
                    <Link href={{ pathname: '/item', query: { id: item.id } }}>
                        <a>{item.title}</a>
                    </Link>
                </Title>
                <PriceTag>{item.price}</PriceTag>
                <div className="buttonList">
                    <Link href={{ pathname: 'update', query: { id: item.id } }}>
                        <a>Edit</a>
                    </Link>
                    <button>Add to Cart</button>
                    <button>Delete</button>
                </div>
            </ItemStyles>
        );
    }
}

export default Item;