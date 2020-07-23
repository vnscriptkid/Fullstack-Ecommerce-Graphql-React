import App, {Container} from 'next/app';
import Page from '../components/Page';
import Meta from '../components/Meta';

class MyApp extends App {
    render() {
        const {Component} = this.props;
        return (
            <Container>
                {/* shared states */}
                <Meta />
                <Page>
                    <Component />
                </Page>
            </Container>
        )
    }
}

export default MyApp;