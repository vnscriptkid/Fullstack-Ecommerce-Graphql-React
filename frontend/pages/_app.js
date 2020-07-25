import App, {Container} from 'next/app';
import Page from '../components/Page';
import Meta from '../components/Meta';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        const pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        pageProps.query = ctx.query;   
        return { pageProps }
    }
    
    render() {
        const {Component, apollo, pageProps} = this.props;
        return (
            <Container>
                {/* shared states */}
                <ApolloProvider client={apollo}>
                    <Meta />
                    <Page {...pageProps}>
                        <Component />
                    </Page>
                </ApolloProvider>
            </Container>
        )
    }
}

export default withData(MyApp);