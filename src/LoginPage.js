import React, {Component} from 'react';
import {Button, TextField} from '@material-ui/core';
import './LoginPage.css';
import firebase from 'firebase/app';

export default class LoginPage extends Component {
    onChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    onEmailSent = () => {
        window.localStorage.setItem("emailForSignIn", this.state.email);
        window.alert("Check your inbox for a link");
    };

    onError = reason => {
        window.alert(`${reason}`);
    };

    onSignInWithEmailLink = () => {
        window.localStorage.removeItem('email');
    };

    onSignInWithEmailLinkFailed = reason => {
        alert(reason);
    };

    signIn = () => {
        firebase.auth().sendSignInLinkToEmail(this.state.email, {
            handleCodeInApp: true,
            url: `http://${window.location.host}`
        })
            .then(this.onEmailSent)
            .catch(this.onError);
    };

    state = {
        email: String()
    };

    componentDidMount() {
        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
            let email = window.localStorage.getItem("emailForSignIn");
            if (email) {
                firebase.auth().signInWithEmailLink(email, window.location.href)
                    .then(this.onSignInWithEmailLink)
                    .catch(this.onSignInWithEmailLinkFailed);
            }
        }
    }

    render() {
        return (
            <div className={"LoginPage"}>
                <div>
                    <TextField
                        fullWidth
                        label={"Email Address"}
                        margin={"dense"}
                        onChange={this.onChange("email")}
                        type={"email"}/>
                    <Button
                        color={"primary"}
                        fullWidth
                        onClick={this.signIn}
                        variant={"outlined"}>Next</Button>
                </div>
            </div>
        );
    }
}