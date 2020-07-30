import React from 'react';
import {Query} from 'react-apollo';
import {GET_CURRENT_USER} from './CurrentUser';
import Signin from './Signin';

const SigninRequired = (props) => {
    return (
        <Query query={GET_CURRENT_USER}>
            {({ data, error, loading }) => {
                if (loading) return <p>Loading...</p>
                const loggedIn = !error && data.me;
                return loggedIn ? props.children : (
                    <div>
                        <p>You must logged in first!</p>
                        <Signin />
                    </div>
                );
            }}
        </Query>
    )
};

export default SigninRequired;