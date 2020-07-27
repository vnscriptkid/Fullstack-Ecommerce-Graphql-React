import React, { Component } from 'react';
import Form from '../components/styles/Form';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import { Mutation } from 'react-apollo';

const SIGN_UP_USER = gql`
    mutation SIGN_UP_USER (
        $email: String!,
        $name: String!
        $password: String!,
    ) {
        signup(
            email: $email
            name: $name
            password: $password
        ) {
            id
            email
            name
            permissions
        }
    }
`;

class Signup extends Component {
    state = {
        email: 'thanh@gmail.com',
        name: 'thanh',
        password: '123456'
    }

    handleOnChange = (e) => {
        const {value, name} = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit = async ({ event, signup }) => {
        event.preventDefault();
        const res = await signup();
        console.log(res);
    }
    
    render() {
        const {email, name, password} = this.state;
        return (
            <Mutation mutation={SIGN_UP_USER} variables={this.state}>
                {(signup, { error, loading }) => {
                    return (
                        <Form onSubmit={(event) => this.handleSubmit({ event, signup })}>
                            <h2>Sign up for an account</h2>
                            <Error error={error}/>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <label htmlFor="email">
                                    Email
                                    <input id="email" name="email" type="email" placeholder="Email" required value={email} onChange={this.handleOnChange}/>
                                </label>
                                <label htmlFor="name">
                                    Name
                                    <input id="name" name="name" type="text" placeholder="Your name" required value={name} onChange={this.handleOnChange}/>
                                </label>
                                <label htmlFor="password">
                                    Password
                                    <input id="password" name="password" type="password" placeholder="Password" required value={password} onChange={this.handleOnChange}/>
                                </label>
                                <button type="submit">Sign up</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }
}

export default Signup;