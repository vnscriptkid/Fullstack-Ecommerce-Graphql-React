import React, { Fragment } from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import CurrentUser from './CurrentUser';
import Signout from './Signout';
import {Mutation} from 'react-apollo';
import { TOGGLE_CART_OPEN_STATE } from './Cart';
import CartCount from './CartCount';
import totalCartItems from '../lib/totalCartItems';

const Nav = (props) => {
    return (
        <CurrentUser>
            {({ data: { me } = {} }) => (
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
                            <Mutation mutation={TOGGLE_CART_OPEN_STATE}>
                                {(toggleCart) => <button onClick={toggleCart}>
                                    Cart
                                    <CartCount count={totalCartItems(me.cart)}/>
                                </button>}
                            </Mutation>
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