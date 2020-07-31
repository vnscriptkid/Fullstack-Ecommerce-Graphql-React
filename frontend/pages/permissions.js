import React from 'react';
import SigninRequired from '../components/SigninRequired'
import Permissions from '../components/Permissions';

const PermissionsPage = () => {
    return (
        <SigninRequired>
            <Permissions />
        </SigninRequired>
    );
};

export default PermissionsPage;