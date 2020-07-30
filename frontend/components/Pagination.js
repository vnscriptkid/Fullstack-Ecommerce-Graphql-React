import React from 'react';
import PaginationStyles from './styles/PaginationStyles';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {perPage} from '../config';
import Head from 'next/head';
import Link from 'next/link';

const ALL_ITEMS_COUNT = gql`
    query ALL_ITEMS_COUNT {
        itemsConnection {
            aggregate{
                count
            }
        }
    }
`;

const Pagination = ({ current }) => {
    return (
        <Query query={ALL_ITEMS_COUNT}>
            {({ data, error, loading }) => {
                if (error) return <p>Error</p>
                if (loading) return <p>Loading...</p>
                const count = data.itemsConnection.aggregate.count;
                const total = Math.ceil(count / perPage);
                return (
                    <PaginationStyles>
                        <Head>
                            <title>Sick Fits - Page {current} of {total}</title>
                        </Head>
                        <Link prefetch href={{ pathname: '/items', query: { page: current - 1 } }}>
                            <a aria-disabled={current <= 1}>Prev</a>
                        </Link>
                        <p>Page {current} of {total}</p>
                        <Link prefetch href={{ pathname: '/items', query: { page: current + 1 } }}>
                            <a aria-disabled={current >= total}>Next</a>
                        </Link>
                    </PaginationStyles>
                );
            }}
        </Query>
    );
};

export default Pagination;