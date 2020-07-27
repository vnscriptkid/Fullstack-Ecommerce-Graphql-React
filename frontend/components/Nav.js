import React from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import CurrentUser from './CurrentUser';

const Nav = (props) => {
    return (
        <NavStyles>
            <Link href="/items">
                <a>Shop</a>
            </Link>
            <Link href="/sell">
                <a>Sell</a>
            </Link>
            <Link href="/signup">
                <a>Signup</a>
            </Link>
            <Link href="/orders">
                <a>Orders</a>
            </Link>
            <Link href="/me">
                <CurrentUser>
                    {({ data: { me } }) => (
                        <a>{me && me.name}</a>
                    )}
                </CurrentUser>
            </Link>
        </NavStyles>
    );
};

export default Nav;