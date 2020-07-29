import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '../components/styles/Form';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import { Mutation } from 'react-apollo';
import { GET_CURRENT_USER } from './CurrentUser';

const RESET_PASSWORD = gql`
    mutation RESET_PASSWORD(
        $password: String!
        $confirmPassword: String!
        $resetToken: String!
    ) {
        resetPassword(
            password: $password
            confirmPassword: $confirmPassword
            resetToken: $resetToken
        ) {
            id
            name
            email
        }
    }
`;

class ResetPassword extends Component {

    static propTypes = {
        token: PropTypes.string.isRequired
    }

    state = {
        password: '',
        confirmPassword: ''
    }
    
    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    
    handleSubmit = async ({ event, reset }) => {
        event.preventDefault();
        const res = reset();
        
    }
    
    render() {
        const {password, confirmPassword} = this.state;
        const variables = { password, confirmPassword, resetToken: this.props.token };
        return (
            <Mutation mutation={RESET_PASSWORD} variables={variables} refetchQueries={[{ query: GET_CURRENT_USER }]}>
                {(reset, { loading, error }) => (
                    <Form onSubmit={(event) => this.handleSubmit({ event, reset })}>
                        <h2>Reset Password</h2>
                        <Error error={error}/>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="password">
                                Password
                                <input id="password" name="password" type="password" placeholder="Password" required value={password} onChange={this.handleOnChange}/>
                            </label>
                            <label htmlFor="confirmPassword">
                                Confirm password
                                <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password" required value={confirmPassword} onChange={this.handleOnChange}/>
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default ResetPassword;