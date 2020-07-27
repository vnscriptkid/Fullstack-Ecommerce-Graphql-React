import React, { Component } from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import {perPage} from '../config';

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY($skip:Int, $first:Int) {
        items(skip: $skip, first: $first) {
            id
            title
            description
            price
            image
            largeImage
        }
    }
`;

const Center = styled.div`
    text-align: center;
`;

const ItemList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
`;

class Items extends Component {
    
    renderPagination = () => (
        <Pagination current={this.props.page}/>
    );
    
    render() {
        const skip = perPage * this.props.page - perPage;
        return (
            <Center>
                    {this.renderPagination()}
                        <Query query={ALL_ITEMS_QUERY} variables={{ skip, first: perPage }}>
                            {({ data, error, loading }) => {
                                if (error) return <p>Error</p>
                                if (loading) return <p>Loading...</p>
                                return (
                                    <ItemList>
                                            {data.items.map(item => <Item key={item.id} item={item}/>)}
                                    </ItemList>
                                );
                            }}
                        </Query>    
                    {this.renderPagination()}
            </Center>
        );
    }
}

export default Items;
export { ALL_ITEMS_QUERY };