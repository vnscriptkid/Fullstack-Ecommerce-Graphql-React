import React, { Fragment } from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import CurrentUser from './CurrentUser';
import Signout from './Signout';

const Nav = (props) => {
    return (
        <CurrentUser>
            {({ data: { me } }) => (
                <NavStyles>
                    <Link href="/items">
                        <a>Shop</a>
                    </Link>
                    {me ? (
                        <Fragment>
                            <Link href="/sell">
                                <a>Sell</a>
                            </Link>
                            <Link href="/orders">
                                <a>Orders</a>
                            </Link>
                            <a><Signout /></a>
                        </Fragment>
                    ) : (
                        <Link href="/signup">
                            <a>Signup</a>
                        </Link>
                    )}
                    
                </NavStyles>
            )}
        </CurrentUser>
    );
};

export default Nav;