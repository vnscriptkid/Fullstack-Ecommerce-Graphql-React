import React from 'react';
import Header from './Header';
import styled, {ThemeProvider, injectGlobal} from 'styled-components';

const theme = {
    maxWidth: '1000px',
    black: '#393939',
    red: '#ff0000',
    grey: '#3a3a3a',
    lightGrey: '#e1e1e1',
    offWhite: '#ededed',
    bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
};

const Inner = styled.div`
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
    padding: 2rem; 
`;

const StyledPage = styled.div`
    color: ${props => props.theme.black};
`;

injectGlobal`
    @font-face {
        font-family: 'radnika_next';
        src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
    }

    html {
        box-sizing: border-box;
        font-size: 10px;
    }

    *, *:before, *:after {
        box-sizing: inherit;
    }

    body {
        padding: 0;
        margin: 0;
        font-size: 1.5rem;
        line-height: 2;
        font-family: 'radnika_next';
    }

    a {
        text-decoration: none;
        color: ${theme.black}
    }
`;

const Page = (props) => {
    return (
        // shared UI
        <ThemeProvider theme={theme}>
            <StyledPage>
                <Header />
                <Inner>
                    {props.children}
                </Inner>
            </StyledPage>
        </ThemeProvider>
    );
};

export default Page;