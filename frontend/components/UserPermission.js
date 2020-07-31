import React, { Component } from 'react';
import { allPermissions } from './Permissions';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const UPDATE_USER_PERMISSIONS = gql`
    mutation UPDATE_USER_PERMISSIONS(
        $userId: ID!,
        $permissions: [Permission]!
    ) {
        updatePermissions(
            userId: $userId,
            permissions: $permissions
        ) {
            permissions
        }
    }
`;

class UserPermission extends Component {

    static propTypes = {
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            permissions: PropTypes.array.isRequired,
        }).isRequired
    }
    
    state = {
        userPermissionList: this.props.user.permissions
    }

    handleCheckboxChange = (e) => {
        const {value, checked} = e.target;
        let newPermissionList = [...this.state.userPermissionList];
        if (checked) { // add permission
            newPermissionList.push(value);
        } else { // remove permission
            newPermissionList = newPermissionList.filter(p => p !== value);
        }
        // render again
        this.setState({ userPermissionList: newPermissionList });
    }

    handleUpdateClick = async ({ event, updatePermissions }) => {
        const res = await updatePermissions();
        console.log(res);
    }
    
    render() {
        const {id, name, email} = this.props.user;
        return (
            <Mutation mutation={UPDATE_USER_PERMISSIONS} variables={{ userId: id, permissions: this.state.userPermissionList }}>
                {(updatePermissions, { error, loading }) => {
                    return (
                        <tr>
                            <td>{name}</td>
                            <td>{email}</td>
                            {allPermissions.map((p, index) => 
                                <td key={`${id}-${p}-${index}`}>
                                    <input value={p} type="checkbox" checked={this.state.userPermissionList.includes(p)} onChange={this.handleCheckboxChange}/>
                                </td>
                            )}
                            <td>
                                <button 
                                    disabled={loading} 
                                    onClick={(event) => this.handleUpdateClick({ event, updatePermissions })}>
                                    UPDATE
                                </button>
                            </td>
                        </tr>
                    );
                }}
            </Mutation>
        );
    }
}

export default UserPermission;