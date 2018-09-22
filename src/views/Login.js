import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField/TextField";
import PropTypes from 'prop-types';
import Paper from "@material-ui/core/Paper/Paper";
import Button from "@material-ui/core/Button/Button";
import firebase from 'firebase/app';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false,
            buttonText: "Sign In",
            email: "",
            password: ""
        };
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.container}>
                <Paper className={classes.paper}>
                    <form onSubmit={this.signIn}>
                        <TextField
                            autoComplete={"username"}
                            fullWidth
                            label={"Email Address"}
                            margin={"dense"}
                            onChange={this.updateStateField('email')}
                            type={"email"}
                            value={this.state.email}/>
                        <TextField
                            autoComplete={"current-password"}
                            fullWidth
                            label={"Password"}
                            margin={"dense"}
                            onChange={this.updateStateField('password')}
                            type={'password'}
                            value={this.state.password}/>
                        <Button className={classes.signInButton} disabled={this.state.buttonDisabled} fullWidth
                                type={"submit"}>{this.state.buttonText}</Button>
                    </form>
                </Paper>
            </div>
        );
    }

    scheduleButtonReset = () => {
        setTimeout(this.setState, 1000, {
            buttonDisabled: false,
            buttonText: "Sign In"
        });
    };

    signIn = e => {
        e.preventDefault();
        const setButton = text => {
            this.setState({buttonDisabled: true, buttonText: text});
        };

        this.setState({buttonText: "Creating account..."});
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .catch(e => {
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        setButton("Signing in...");
                        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                            .catch(e => {
                                switch (e.code) {
                                    case 'auth/wrong-password':
                                        setButton("Wrong Password");
                                        break;
                                    default:
                                        setButton("Failed");
                                        break;
                                }
                                this.scheduleButtonReset();
                            });
                        break;
                    case 'auth/weak-password':
                        setButton('Weak Password');
                        break;
                    default:
                        setButton("Failed");
                        break;
                }
                this.scheduleButtonReset();
            });
    };

    updateStateField = field => e => {
        this.setState({[field]: e.target.value});
    };
}

Login.propTypes = {
    classes: PropTypes.object.isRequired
};

Login.styles = theme => ({
    container: {
        alignItems: 'center',
        display: 'flex',
        height: 'calc(100vh - 56px)',
        justifyContent: 'center',
        marginTop: 56,
        [theme.breakpoints.up('md')]: {
            height: 'calc(100vh - 64px)',
            marginTop: 64
        }
    },
    paper: {
        padding: 32
    },
    signInButton: {
        margin: "8px 0"
    }
});

export default withStyles(Login.styles)(Login);