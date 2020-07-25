import React from 'react';
import Nav from './Nav';
import styled from 'styled-components';
import Link from 'next/link';
import Nprogress from 'nprogress';
import Router from 'next/router';

Router.onRouteChangeStart = () => {
    Nprogress.start();
}

Router.onRouteChangeComplete = () => {
    Nprogress.done();
}

Router.onRouteChangeError = () => {
    Nprogress.done();
}


const Logo = styled.h1`
    font-size: 4rem;
    margin-left: 2rem;
    position: relative;
    z-index: 2;
    transform: skew(-7deg);

    a {
        padding: 0.5rem 1rem;
        text-decoration: none;
        background: ${props => props.theme.red};
        color: white;
        text-transform: uppercase;
    }

    @media (max-width: 1300px) {
        margin: 0;
        text-align: center;
    }
`;

const StyledHeader = styled.header`
    .bar {
        border-bottom: 10px solid ${props => props.theme.black};
        display: grid;
        /* grid-template-columns: auto 1fr; */
        justify-content: space-between;
        align-items: stretch;

        @media (max-width: 1300px) {
            grid-template-columns: 1fr;
            justify-content: center;
        }
    }

    .sub-bar {
        display: grid;
        grid-template-columns: 1fr auto;
        border-bottom: 10px solid ${props => props.theme.lightGrey};
    }
`;

const Header = () => {
    return (
        <StyledHeader>
            <div className="bar">
                <Logo>
                    <Link href="/">
                        <a>Sick Fits</a>
                    </Link>
                </Logo>
                <Nav />
            </div>
            <div className="sub-bar">
                <p>Search</p>
            </div>
            <div>Cart</div>
        </StyledHeader>
    );
};

export default Header;