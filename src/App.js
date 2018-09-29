import ActiveUser from './contexts/ActiveUser';
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Header, {drawerWidth} from './components/Header';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/Typography";
import firebase from "firebase/app";
import Login from "./views/Login";
import settings from "./settings";

class App extends Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({authenticated: user !== null});
            if (user) {
                this.unsubscribe = firebase.firestore().doc(`users/${user.uid}`)
                    .onSnapshot(snapshot => {
                        this.setState({user: Object.assign(this.state.user, snapshot.data())});
                    });
            } else {
                this.unsubscribe();
            }
        });
        settings.tabs[0].get().then(tab => {
            this.setState({content: tab});
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            content: <Typography>Loading your profile...</Typography>,
            user: settings.defaultProfile
        };
    }

    render() {
        const
            {authenticated} = this.state,
            {classes} = this.props;

        return (
            <React.Fragment>
                <ActiveUser.Provider value={this.state.user}>
                    <CssBaseline/>
                    <Header authenticated={authenticated} onNewContent={this.updateContent}/>
                    {authenticated && <div className={classes.content}>{this.state.content}</div>}
                    {!authenticated && <Login/>}
                </ActiveUser.Provider>
            </React.Fragment>
        );
    }

    updateContent = content => {
        this.setState({content});
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired
};

App.styles = theme => ({
    content: {
        marginTop: 56,
        maxHeight: `calc(100vh - 56px)`,
        [theme.breakpoints.up('md')]: {
            marginLeft: drawerWidth,
            marginTop: 64,
            maxHeight: `calc(100vh - 64px)`,
            maxWidth: `calc(100vw - ${drawerWidth}px)`,
            overflowX: 'scroll'
        }
    }
});

export default withStyles(App.styles)(App);