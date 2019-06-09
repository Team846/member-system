import * as PropTypes from "prop-types";
import {asyncComponent} from "react-async-component";
import {CircularProgress, createMuiTheme, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {deepOrange as primary} from "@material-ui/core/colors";
import firebase from "firebase/app";
import React, {Component} from 'react';
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import {ActiveUser, permissionLevels, routes} from "./settings";
import {SnackbarProvider} from "notistack";
import "firebase/auth";

/**
 * If the user has logged in to the app, show the route. Otherwise, redirect them to the login page and store their location
 * @param Component The component parameter that you'd pass to Route
 * @param props The props you want to provide to the component
 * @returns {*}
 * @constructor
 */
function PrivateRoute({component: Component, ...props}) {
    return (
        <Route
            render={props =>
                firebase.auth().currentUser !== null
                    ? <Component {...props} />
                    : <Redirect to={{
                        pathname: routes.public.LOGIN.path,
                        state: {
                            from: props.location
                        }
                    }}/>
            }
            {...props} />
    )
}

class App extends Component {
    /**
     * Set up a listener that will re-render the app when auth state changes. It will also start an asynchronous request to get the user's full profile information
     */
    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firebase.firestore().doc(`users/${user.uid}`).get().then(snapshot => {
                    this.setState({
                        activeUserProfile: snapshot.data() || this.state.activeUserProfile
                    });
                });
            }
            this.setState({
                authEvaluation: user
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    render() {
        return this.state.authEvaluation !== undefined
            ? <SnackbarProvider>
                <ActiveUser.Provider value={this.state.activeUserProfile}>
                    <CssBaseline/>
                    <MuiThemeProvider theme={App.theme}>
                        <Switch>
                            {Object.values(routes.public)
                                .map(App.routeFromDescriptor(Route))}
                            {Object.values(routes.private)
                                .map(App.routeFromDescriptor(PrivateRoute))}
                            <Route render={props => <Redirect to={{pathname: "/login"}} {...props} />}/>
                        </Switch>
                    </MuiThemeProvider>
                </ActiveUser.Provider>
            </SnackbarProvider>
            : <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh"
            }}><CircularProgress/></div>;
    }

    static routeFromDescriptor = RouteComponent => descriptor => {
        const {resolve, ...others} = descriptor;

        return (
            <RouteComponent
                component={asyncComponent({
                    resolve
                })}
                key={descriptor.path}
                {...others}
            />
        );
    };

    state = {
        activeUserProfile: {
            permissionLevel: permissionLevels[0]
        },
        authEvaluation: undefined
    };

    static theme = createMuiTheme({
        palette: {
            primary
        }
    });
}

export default withRouter(App);