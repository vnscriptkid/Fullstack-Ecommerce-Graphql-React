import React, { Component } from 'react';
import {Mutation, Query} from 'react-apollo';
import formatMoney from '../lib/formatMoney';
import Form from '../components/styles/Form';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Router from 'next/router';

const GET_SINGLE_ITEM = gql`
    query GET_SINGLE_ITEM(
        $id: ID!
    ) {
        item(where: { id: $id }) {
            id
            title
            description
            price
        }
    }
`;

const UPDATE_ITEM = gql`
    mutation UPDATE_ITEM(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
        ) {
            id,
            title,
            description,
            price
        }
    }
`;

class UpdateItem extends Component {

    state = { }

    handleOnChange = (e) => {
        const {value, name, type} = e.target;

        const castedValue = (type === 'number' && !value) ? parseFloat(value) : value;
        
        this.setState({ [name]: castedValue });
    }

    handleOnSubmit = async ({ event, updateItem }) => {
        event.preventDefault();
        await updateItem();
    }
    
    render() {
        return (
            <Query query={GET_SINGLE_ITEM} variables={{ id: this.props.id }}>
                {({ data, error, loading }) =>  {
                    if (error) return <p>Error</p>
                    if (loading) return <p>Loading</p>
                    if (!data.item) return <p>No item found</p>
                    return (
                        <Mutation mutation={UPDATE_ITEM} variables={{ id: this.props.id, ...this.state }}>
                            {(updateItem, { loading, error }) => (
                                <Form onSubmit={(event) => this.handleOnSubmit({ event, updateItem })}>
                                    <Error error={error}/>
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor="title">
                                            Title
                                            <input id="title" name="title" type="text" placeholder="Title" required defaultValue={data.item.title} onChange={this.handleOnChange}/>
                                        </label>
                                        <label htmlFor="price">
                                            Price
                                            <input id="price" name="price" type="number" placeholder="Price" required defaultValue={data.item.price} onChange={this.handleOnChange}/>
                                        </label>
                                        <label htmlFor="description">
                                            Description
                                            <textarea id="description" name="description" placeholder="Description" required defaultValue={data.item.description} onChange={this.handleOnChange}/>
                                        </label>
                                        <button type="submit">Submit</button>
                                    </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
        
    }
}

export default UpdateItem;
export { GET_SINGLE_ITEM };