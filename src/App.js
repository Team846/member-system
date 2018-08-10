import React, {Component} from 'react';
import {
    AppBar,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    Typography
} from '@material-ui/core';
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import {red} from '@material-ui/core/colors';
import {Menu} from '@material-ui/icons';
import './App.css';
import firebase from 'firebase/app';
import MemberCards from "./MemberCards";
import Login from "./Login";

export const theme = createMuiTheme({
    palette: {
        primary: red
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: <MemberCards/>,
            loggedIn: false,
            menuOpen: false,
            tabs: [{
                label: "Members",
                async tab() {
                    return <MemberCards/>
                }
            }, {
                component: null,
                label: "Profile Editor",
                async tab() {
                    if (!this.component) {
                        this.component = (await import(/* webpackChunkName: "profile" */"./Profile")).default
                    }
                    return <this.component/>
                }
            }]
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                loggedIn: user !== null
            });
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <MuiThemeProvider
                theme={theme}>
                <CssBaseline>
                    <AppBar>
                        <Toolbar>
                            <IconButton className={classes.menuIcon} color={"inherit"} onClick={() => this.setState({
                                menuOpen: !this.state.menuOpen
                            })}>
                                <Menu/>
                            </IconButton>
                            <Typography color={"inherit"} variant={"title"}>Member System</Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        open={this.state.menuOpen}
                        onClose={() => this.setState({
                            menuOpen: false
                        })}>
                        <List className={"list"} onClick={() => this.setState({
                            menuOpen: false
                        })}>
                            {this.state.tabs.map(tab => {
                                return <ListItem button key={tab.label} onClick={() => {
                                    tab.tab().then(tab => {
                                        this.setState({
                                            content: tab
                                        });
                                    })
                                }}>
                                    <ListItemText primary={tab.label}/>
                                </ListItem>
                            })}
                        </List>
                    </Drawer>
                    <div className={"content"}>
                        {!this.state.loggedIn && <Login/>}
                        {this.state.loggedIn && this.state.content}
                    </div>
                </CssBaseline>
            </MuiThemeProvider>
        );
    }
}

export default withStyles({
    menuIcon: {
        marginLeft: -12,
        marginRight: 20
    }
})(App);