import * as PropTypes from "prop-types";
import Authentication from "../../components/Authentication";
import Button from '../../components/Button';
import firebase from "firebase/app";
import Input from "../../components/Input";
import {Link, Redirect} from "react-router-dom";
import {model, routes} from "../../settings";
import React, {Component} from 'react';
import {Typography} from "@material-ui/core";
import {withSnackbar} from "notistack";

class Login extends Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                redirectToReferrer: user !== null
            });
        });
    }

    login = e => {
        const {enqueueSnackbar} = this.props;

        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(e => enqueueSnackbar(e.message, {
                variant: "error"
            }));
    };

    loginWithGoogle = () => {
        const {enqueueSnackbar} = this.props;
        firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
            .catch(e => enqueueSnackbar(e.message, {
                variant: "error"
            }));
    };

    static propTypes = {
        enqueueSnackbar: PropTypes.func.isRequired
    };

    render() {
        const {from} = this.props.location.state || {from: {pathname: "/"}};

        if (this.state.redirectToReferrer) {
            return (
                <Redirect
                    to={from}/>
            )
        }

        return (
            <Authentication onSubmit={this.login} title="Login">
                <Input
                    autoComplete="email username"
                    autoFocus
                    label="Email Address"
                    required
                    {...model(this)("email")} />
                <Input
                    autoComplete="current-password"
                    label="Password"
                    required
                    type="password"
                    {...model(this)("password")}/>
                <Link to={routes.public.RESET.path}><Typography>Forgot your password?</Typography></Link>
                <Button type="submit">Login</Button>
                <Button onClick={this.loginWithGoogle} variant={"outlined"}>Login with Google</Button>
                <Link to={{
                    pathname: routes.public.REGISTER.path,
                    state: {from}
                }}>
                    <Button variant={"outlined"}>Create an account</Button>
                </Link>
            </Authentication>
        );
    }

    state = {
        email: "",
        password: "",
        redirectToReferrer: false
    };
}

export default withSnackbar(Login);