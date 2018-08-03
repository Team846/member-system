import React, {Component} from 'react';
import './App.css';
import {AppBar, Button, CssBaseline, Toolbar, Typography} from '@material-ui/core';
import {blue} from '@material-ui/core/colors';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import firebase from 'firebase/app';
import LoginPage from "./LoginPage";
import ProfileEditor from "./ProfileEditor";
import MemberCards from "./MemberCards";

class App extends Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
        firebase.firestore().collection('users').onSnapshot(snapshot => {
            this.setState({
                users: snapshot.docs.map(doc => doc.data())
            });
        });
    };

    onAuthStateChanged = user => {
        this.setState({user})
    };

    signOut = () => {
        // noinspection JSIgnoredPromiseFromCall
        firebase.auth().signOut();
    };

    state = {
        user: null
    };

    theme = createMuiTheme({
        palette: {
            primary: blue
        }
    });

    render() {
        const {user, users} = this.state;
        return (
            <CssBaseline>
                <MuiThemeProvider theme={this.theme}>
                    <AppBar>
                        <Toolbar>
                            <Typography className={"grow"} color={"inherit"} variant={"title"}>
                                Member System
                            </Typography>
                            {user &&
                            <Button color={"inherit"} onClick={this.signOut}>Sign Out</Button>}
                        </Toolbar>
                    </AppBar>
                    {!user && <LoginPage/>}
                    {user && users && <ProfileEditor user={user} users={users}/>}
                    {user && users && <MemberCards users={users}/>}
                </MuiThemeProvider>
            </CssBaseline>
        );
    }
}

export default App;
