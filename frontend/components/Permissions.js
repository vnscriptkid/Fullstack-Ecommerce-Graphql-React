import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import Table from './styles/Table';
import UserPermission from './UserPermission';

const GET_USER_LIST = gql`
    query GET_USER_LIST {
        users {
            id,
            email,
            name,
            permissions
        }
    }
`;

const allPermissions = [
    "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
]

class Permissions extends Component {
    render() {
        return (
            <Query query={GET_USER_LIST}>
                {({ data, error, loading }) => {
                    if (loading) return <p>Loading...</p>
                    console.log(data);
                    return (
                        <div>
                            <h2>Permissions Table</h2>
                            <Error error={error}/>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        {allPermissions.map(p => <th key={p}>{p}</th>)}
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.users.map(user => <UserPermission key={user.id} user={user}/>)}
                                </tbody>
                            </Table>
                        </div>
                    )
                }}
            </Query>
        );
    }
}

export default Permissions;
export { allPermissions }