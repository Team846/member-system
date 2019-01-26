import * as PropTypes from "prop-types";
import {asyncComponent} from "react-async-component";
import {createMuiTheme, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {deepOrange as primary} from "@material-ui/core/colors";
import firebase from "firebase/app";
import React, {Component, Fragment} from 'react';
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import {routes} from "./settings";
import {SnackbarProvider} from "notistack";
import "firebase/auth";

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
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                authEvaluation: user
            })
        });
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    render() {
        return this.state.authEvaluation !== undefined ? (
            <SnackbarProvider maxStack={3}>
                <Fragment>
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
                </Fragment>
            </SnackbarProvider>) : null;
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
        authEvaluation: undefined
    };

    static theme = createMuiTheme({
        palette: {
            primary
        },
        typography: {
            useNextVariants: true
        }
    });
}

export default withRouter(App);