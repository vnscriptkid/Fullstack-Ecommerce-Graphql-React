import React from 'react';
import ResetPassword from '../components/ResetPassword';

const ResetPage = (props) => {
    return (
        <div>
            <ResetPassword token={props.query.token}/>
        </div>
    );
};

export default ResetPage;