import React, { Component } from 'react';
import Form from '../components/styles/Form';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import { Mutation } from 'react-apollo';
import { GET_CURRENT_USER } from './CurrentUser';

const SIGN_IN_USER = gql`
    mutation SIGN_IN_USER (
        $email: String!,
        $password: String!
    ) {
        signin(
            email: $email
            password: $password
        ) {
                id,
                email,
                name
            }
    }
`;

class Signin extends Component {
    state = {
        email: 'vnscriptkid@gmail.com',
        password: '123456'
    }

    handleOnChange = (e) => {
        const {value, name} = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit = async ({ event, signin }) => {
        event.preventDefault();
        const res = await signin();
        console.log(res);
    }
    
    render() {
        const {email, password} = this.state;
        return (
            <Mutation mutation={SIGN_IN_USER} variables={this.state} refetchQueries={[{ query: GET_CURRENT_USER }]}>
                {(signin, {loading, error}) => {
                    return (
                        <Form onSubmit={(event) => this.handleSubmit({ event, signin })}>
                            <h2>Sign in now!</h2>
                            <Error error={error}/>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <label htmlFor="email">
                                    Email
                                    <input id="email" name="email" type="email" placeholder="Email" required value={email} onChange={this.handleOnChange}/>
                                </label>
                                <label htmlFor="password">
                                    Password
                                    <input id="password" name="password" type="password" placeholder="Password" required value={password} onChange={this.handleOnChange}/>
                                </label>
                                <button type="submit">Sign in</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }
}

export default Signin;