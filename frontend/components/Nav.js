import React, { Fragment } from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import CurrentUser from './CurrentUser';
import Signout from './Signout';
import {Mutation} from 'react-apollo';
import { TOGGLE_CART_OPEN_STATE } from './Cart';

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
                            <Link href="/permissions">
                                <a>Permissions</a>
                            </Link>
                            <a><Signout /></a>
                        </Fragment>
                    ) : (
                        <Link href="/signup">
                            <a>Signup</a>
                        </Link>
                    )}
                    <Mutation mutation={TOGGLE_CART_OPEN_STATE}>
                        {(toggleCart) => <a onClick={toggleCart}>Cart</a>}
                    </Mutation>
                    
                </NavStyles>
            )}
        </CurrentUser>
    );
};

export default Nav;