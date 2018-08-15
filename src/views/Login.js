import React, {Component} from 'react';
import './Login.css';
import {Button, Card, TextField, Typography} from '@material-ui/core';
import firebase from 'firebase';

class Login extends Component {
    componentDidMount() {
        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
            this.setState({
                isSignInLink: true
            });
            const email = localStorage.getItem('email');
            if (email) {
                this.signIn(email);
            } else {
                this.setState({
                    submitButton: {
                        disabled: false,
                        text: "Sign In"
                    }
                });
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            email: "",
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

    onFormSubmit = e => {
        e.preventDefault();
        if (this.state.isSignInLink) {
            this.signIn(this.state.email);
        } else {
            localStorage.setItem('email', this.state.email);
            this.setState({
                submitButton: {
                    disabled: true,
                    text: "Sending..."
                }
            });
            firebase.auth().sendSignInLinkToEmail(this.state.email, {
                handleCodeInApp: true,
                url: window.location.href
            })
                .then(() => {
                    this.setState({
                        submitButton: {
                            disabled: true,
                            text: "Sent"
                        }
                    })
                })
                .catch(reason => {
                    this.setState({
                        submitButton: {
                            disabled: true,
                            text: "Failed"
                        }
                    });
                    console.error(reason);
                });
        }
        this.scheduleButtonReset();
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
                        <Typography variant={"caption"}>You'll receive a sign-in email</Typography>
                        <Button
                            className={"moderately-wide"}
                            disabled={this.state.submitButton.disabled}
                            type={"submit"}>
                            {this.state.submitButton.text}
                        </Button>
                    </form>
                </Card>
            </div>
        );
    }

    scheduleButtonReset = () => {
        setTimeout(() => {
            this.setState({
                submitButton: {
                    disabled: false,
                    text: "Next"
                }
            });
        }, 1000);
    };

    signIn = email => {
        this.setState({
            submitButton: {
                disabled: true,
                text: "Signing In..."
            }
        });
        firebase.auth().signInWithEmailLink(email, window.location.href)
            .then(() => {
                this.setState({
                    submitButton: {
                        disabled: true,
                        text: "Signed In"
                    }
                })
            });
    }
}

export default Login;