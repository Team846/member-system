import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Header, {drawerWidth} from './components/Header';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/Typography";
import firebase from "firebase/app";
import Login from "./views/Login";

class App extends Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({authenticated: user !== null});
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            content: <Typography>Loading your profile...</Typography>
        };
    }

    render() {
        const
            {authenticated} = this.state,
            {classes} = this.props;

        return (
            <React.Fragment>
                <CssBaseline/>
                <Header authenticated={authenticated} onNewContent={this.updateContent}/>
                {authenticated && <div className={classes.content}>{this.state.content}</div>}
                {!authenticated && <Login/>}
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
        [theme.breakpoints.up('md')]: {
            marginLeft: drawerWidth,
            marginTop: 64
        }
    }
});

export default withStyles(App.styles)(App);