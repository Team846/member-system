import React, {Component} from 'react';
import './Login.css';
import {Button, Card, TextField, Typography} from '@material-ui/core';
import firebase from 'firebase/app';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isSignInLink: false,
            submitButton: {
                disabled: false,
                text: "Next"
            }
        };
    }

    onEmailChanged = e => {
        this.setState({
            email: e.target.value
        });
    };

    onPasswordChanged = e => {
        this.setState({
            password: e.target.value
        });
    };

    onFormSubmit = e => {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(reason => {
                if (reason.code === "auth/user-not-found") {
                    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
                } else {
                    this.setState({
                        submitButton: {
                            disabled: true,
                            text: "Failed"
                        }
                    });
                }
            });
    };

    render() {
        return (
            <div className={"Login"}>
                <Card>
                    <form onSubmit={this.onFormSubmit}>
                        <Typography align={"center"} variant={"headline"}>Sign In</Typography>
                        <TextField
                            label={"Email Address"}
                            margin={"dense"}
                            onChange={this.onEmailChanged}
                            value={this.state.email}/>
                        <TextField
                            label={"Password"}
                            margin={"dense"}
                            onChange={this.onPasswordChanged}
                            type={"password"}
                            value={this.state.password}/>
                        <Button
                            fullWidth
                            disabled={this.state.submitButton.disabled}
                            type={"submit"}>
                            {this.state.submitButton.text}
                        </Button>
                    </form>
                </Card>
            </div>
        );
    }
}

export default Login;