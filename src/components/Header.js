import AppBar from "@material-ui/core/AppBar/AppBar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Menu from "@material-ui/icons/Menu";
import PropTypes from "prop-types";
import React, {Component, Fragment} from 'react';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Hidden from "@material-ui/core/Hidden/Hidden";
import Drawer from "@material-ui/core/Drawer/Drawer";
import settings from "../settings";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import List from "@material-ui/core/List/List";
import firebase from 'firebase/app';
import ActiveUser from "../contexts/ActiveUser";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileDrawerIsOpen: false
        };
    }

    closeMobileDrawer = () => {
        this.setState({mobileDrawerIsOpen: false});
    };

    onTabClicked = tab => () => {
        tab.get().then(content => this.props.onNewContent(content));
    };

    openMobileDrawer = () => {
        this.setState({mobileDrawerIsOpen: true});
    };

    render() {
        const
            {authenticated, classes} = this.props,
            drawerClasses = {
                paper: `${classes.drawerPaper} ${authenticated ? classes.drawerPaperOpen : ""}`
            },
            menuIcon = <IconButton className={classes.menuIcon} color={"inherit"} onClick={this.openMobileDrawer}>
                <Menu/>
            </IconButton>,
            {mobileDrawerIsOpen} = this.state,
            title = <Typography color={"inherit"} variant={"title"}>Member System</Typography>,
            tabs = (
                <List>
                    <Hidden smDown>
                        <ListItem>
                            {title}
                        </ListItem>
                    </Hidden>
                    <ActiveUser.Consumer>
                        {user => settings.tabs
                            .filter(tab => settings.permissionLevels.indexOf(user.permissionLevel) >= settings.permissionLevels.indexOf(tab.minPermissionLevel))
                            .map(tab => {
                                return (
                                    <ListItem button key={tab.label} onClick={this.onTabClicked(tab)}>
                                        <ListItemText>{tab.label}</ListItemText>
                                        {tab.icon && <ListItemIcon>{tab.icon}</ListItemIcon>}
                                    </ListItem>
                                );
                            })}
                    </ActiveUser.Consumer>
                    <ListItem button onClick={() => {
                        firebase.auth().signOut().then(() => window.location.reload());
                    }}>
                        <ListItemText>Sign Out</ListItemText>
                    </ListItem>
                </List>
            );

        return (
            <Fragment>
                <AppBar className={`${classes.appBar} ${authenticated ? classes.appBarWhenDrawerIsOpen : ""}`}>
                    <Toolbar>
                        <Hidden mdUp>
                            {authenticated && menuIcon}
                            {title}
                        </Hidden>
                        <Hidden smDown>
                            {authenticated === false && title}
                        </Hidden>
                    </Toolbar>
                </AppBar>
                <Hidden mdUp>
                    <Drawer onClose={this.closeMobileDrawer} open={mobileDrawerIsOpen} variant={"temporary"}>
                        {tabs}
                    </Drawer>
                </Hidden>
                <Hidden smDown>
                    <Drawer classes={drawerClasses} variant={"permanent"}>
                        {tabs}
                    </Drawer>
                </Hidden>
            </Fragment>
        );
    }
}

Header.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    onNewContent: PropTypes.func.isRequired
};

export const drawerOpenDuration = "500ms", drawerWidth = 280;

Header.styles = theme => ({
    appBar: {
        left: 0,
        transition: `left ${drawerOpenDuration}, width ${drawerOpenDuration}`,
        width: "100vw"
    },
    appBarWhenDrawerIsOpen: {
        [theme.breakpoints.up('md')]: {
            left: drawerWidth,
            width: `calc(100vw - ${drawerWidth}px)`
        }
    },
    drawerPaper: {
        '& *': {
            whiteSpace: 'nowrap'
        },
        transition: `width ${drawerOpenDuration}`,
        width: 0
    },
    drawerPaperOpen: {
        width: drawerWidth
    },
    menuIcon: {
        marginLeft: -8,
        marginRight: 16
    }
});

export default withStyles(Header.styles)(Header);