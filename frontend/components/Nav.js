import React from 'react';
import Link from 'next/link';

const Nav = (props) => {
    return (
        <div>
            <Link href="/products">
                <a>Products</a>
            </Link>
            <Link href="/cart">
                <a>Cart</a>
            </Link>
            <Link href="/search">
                <a>Search</a>
            </Link>
        </div>
    );
};

export default Nav;