import * as PropTypes from "prop-types";
import Authentication from "../../components/Authentication";
import Button from '../../components/Button';
import firebase from "firebase/app";
import Input from "../../components/Input";
import {model} from "../../settings";
import React, {Component} from 'react';
import {withSnackbar} from "notistack";

class Reset extends Component {
    static propTypes = {
        enqueueSnackbar: PropTypes.func.isRequired
    };

    render() {
        return (
            <Authentication onSubmit={this.reset} title="Password Reset">
                <Input
                    autoComplete="email username"
                    autoFocus
                    label="Email Address"
                    required
                    {...model(this)("email")} />
                <Button type="submit">Send Reset Email</Button>
            </Authentication>
        );
    }

    reset = e => {
        const {enqueueSnackbar} = this.props;

        e.preventDefault();
        firebase.auth().sendPasswordResetEmail(this.state.email)
            .catch(e => enqueueSnackbar(e.message));
    };

    state = {
        email: ""
    };
}

export default withSnackbar(Reset);