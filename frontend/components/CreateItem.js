import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import formatMoney from '../lib/formatMoney';
import Form from '../components/styles/Form';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Router from 'next/router';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItem extends Component {

    state = {
        title: 'newest',
        description: 'very good',
        price: 678,
        image: 'https://www.chloe.com/11/11743523uu_22_f.jpg',
        largeImage: 'https://www.chloe.com/11/11743523uu_22_f.jpg'
    }

    handleOnChange = (e) => {
        const {value, name, type} = e.target;

        const castedValue = (type === 'number' && !value) ? parseFloat(value) : value;
        
        this.setState({ [name]: castedValue });
    }

    handleOnSubmit = async ({ event, createItem }) => {
        event.preventDefault();
        const res = await createItem();
        Router.push({
            pathname: '/item',
            query: { id: res.data.createItem.id }
        })
    }

    handleUpload = async (e) => {
        console.log('uploading file...', e.target);
        const files = e.target.files;
        if (files.length === 0) return;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const res = await fetch('https://api.cloudinary.com/v1_1/vnscriptkid/image/upload', {
            method: 'POST',
            body: data
        });
        const file = await res.json();
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        });
    }
    
    render() {
        const {title, description, price, image} = this.state;
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error }) => (
                    <Form onSubmit={(event) => this.handleOnSubmit({ event, createItem }) }>
                        <Error error={error}/>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="image">
                                Image
                                <input id="image" name="image" type="file" placeholder="Upload an image" required onChange={this.handleUpload}/>
                                {image && <img src={image} width="200" alt="Upload Preview"/>}
                            </label>
                            <label htmlFor="title">
                                Title
                                <input id="title" name="title" type="text" placeholder="Title" required value={title} onChange={this.handleOnChange}/>
                            </label>
                            <label htmlFor="price">
                                Price
                                <input id="price" name="price" type="number" placeholder="Price" required value={price} onChange={this.handleOnChange}/>
                            </label>
                            <label htmlFor="description">
                                Description
                                <textarea id="description" name="description" placeholder="Description" required value={description} onChange={this.handleOnChange}/>
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };