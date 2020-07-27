import React, {Fragment} from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const GET_CURRENT_USER = gql`
    query GET_CURRENT_USER {
        me {
            id,
            name,
            email,
            permissions
        }
    }
`;

const CurrentUser = (props) => {
    return (
        <Query query={GET_CURRENT_USER}>
            {
                (payload) => props.children(payload)
            }
        </Query>
    );
};

CurrentUser.PropTypes = {
    children: PropTypes.func.isRequired
}

// <CurrentUser> (payload) => { return <div>jsx</div> } </CurrentUser>

export default CurrentUser;