import React, { Component } from 'react';
import { allPermissions } from './Permissions';
import PropTypes from 'prop-types';

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
    
    render() {
        const {id, name, email} = this.props.user;
        return (
            <tr>
                <td>{name}</td>
                <td>{email}</td>
                {allPermissions.map((p, index) => 
                    <td key={`${id}-${p}-${index}`}>
                        <input value={p} type="checkbox" checked={this.state.userPermissionList.includes(p)} onChange={this.handleCheckboxChange}/>
                    </td>
                )}
            </tr>
        );
    }
}

export default UserPermission;