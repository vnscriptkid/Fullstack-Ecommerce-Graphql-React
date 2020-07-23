import React from 'react';
import Header from './Header';

const Page = (props) => {
    return (
        <div>
            {/* shared UI */}
            <h1>Sick Fits</h1>
            <Header />
          {props.children}
        </div>
    );
};

export default Page;