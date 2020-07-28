import React, {Fragment} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import { GET_CURRENT_USER } from './CurrentUser';

const SIGN_ME_OUT = gql`
    mutation SIGN_ME_OUT {
        signout {
            message
        }
    }
`;

const Signout = (props) => {
    return (
        <Mutation mutation={SIGN_ME_OUT} refetchQueries={[{ query: GET_CURRENT_USER }]}>
            {
                (signout, { loading, error }) => {
                    return <span onClick={async (e) => {
                        e.preventDefault();
                        const res = await signout();
                        console.log(res);
                    }}>Sign out</span>
                }
            }
        </Mutation>
    );
};

export default Signout;