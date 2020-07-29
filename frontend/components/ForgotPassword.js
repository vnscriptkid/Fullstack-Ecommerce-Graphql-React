import React, { Component } from 'react';
import Form from './styles/Form';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import { Mutation } from 'react-apollo';

const REQUEST_RESET = gql`
    mutation REQUEST_RESET($email: String!) {
        requestReset(
            email: $email
        ) {
            message
        }
    }
`;

class ForgotPassword extends Component {
    state = {
        email: 'vnscriptkid@gmail.com',
    }

    handleSubmit = async ({ event, reset }) => {
        event.preventDefault();
        await reset();
    }
    
    render() {
        return (
            <Mutation mutation={REQUEST_RESET} variables={this.state}>
                {(reset, {loading, error, called}) => {
                    return (
                        <Form onSubmit={(event) => this.handleSubmit({ event, reset })}>
                            <h2>Forgot Password</h2>
                            {!loading && !error && called && <p>Success! Please check your email</p>}
                            <Error error={error}/>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <label htmlFor="email">
                                    Email
                                    <input id="email" name="email" type="email" placeholder="Email" required value={this.state.email} 
                                        onChange={(e) => this.setState({ email: e.target.value })}/>
                                </label>
                                <button type="submit">Reset</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }
}

export default ForgotPassword;