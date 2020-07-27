import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Head from 'next/head';

const GET_SINGLE_ITEM = gql`
    query GET_SINGLE_ITEM(
        $id: ID!
    ) {
        item(where: { id: $id }) {
            id,
            title,
            description,
            largeImage
        } 
    }
`;

const SingleItemStyles = styled.div`
    max-width: 1200px;
    margin: 2rem auto;
    box-shadow: ${props => props.theme.bs};
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    min-height: 800px;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .details {
        margin: 3rem;
        font-size: 2rem;
    }
`;

const ItemDetail = ({ id }) => {
    return (
        <Query query={GET_SINGLE_ITEM} variables={{ id }}>
            {({ data, loading, error }) => {
                if (error) return <p>Error</p>
                if (loading) return <p>loading</p>
                if (!data.item) return <p>Item not Found!</p>
                const { title, largeImage, description } = data.item;
                return (
                    <SingleItemStyles>
                        <Head>
                            <title>{title}</title>
                        </Head>
                        <img src={largeImage} alt={title}/>
                        <div className="details">
                            <h2>Viewing {title}</h2>
                            <p>{description}</p>
                        </div>
                    </SingleItemStyles>
                );
            }}
        </Query>
    );
};

export default ItemDetail;