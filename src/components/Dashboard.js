import * as PropTypes from 'prop-types';
import {ActiveUser, hasPermissionLevel, routes} from "../settings";
import {AppBar, Drawer, IconButton, List, ListItem, ListItemText, Toolbar, Typography} from '@material-ui/core';
import React, {Component, Fragment} from 'react';
import {Menu} from "@material-ui/icons";
import {withStyles} from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";

class Dashboard extends Component {
    closeDrawer = () => {
        this.setState({
            open: false
        });
    };

    openDrawer = () => {
        this.setState({
            open: true
        });
    };

    static propTypes = {
        children: PropTypes.any.isRequired,
        classes: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired
    };

    render() {
        const {children, classes, title} = this.props;
        return (
            <ActiveUser.Consumer>{
                activeUser => (
                    <Fragment>
                        <AppBar>
                            <Toolbar className={classes.toolbar}>
                                <IconButton className={classes.menuButton} color="inherit" onClick={this.openDrawer}>
                                    <Menu/>
                                </IconButton>
                                <Typography color="inherit" component="h1" variant="h5">{title}</Typography>
                            </Toolbar>
                        </AppBar>
                        <Drawer classes={{paper: classes.drawerPaper}} onClose={this.closeDrawer} open={this.state.open}
                                variant="temporary">
                            <List>
                                <ListItem>
                                    <ListItemText>
                                        <Typography variant="h5">Member System</Typography>
                                    </ListItemText>
                                </ListItem>
                                {Object.values(routes.private).map(route => hasPermissionLevel(route.minPermissionLevel || "Standard") && route.hidden !== true
                                    ? <ListItem button key={route.path}
                                                onClick={() => this.props.history.push(route.path)}>
                                        <ListItemText>{route.label}</ListItemText>
                                    </ListItem>
                                    : null)}
                            </List>
                        </Drawer>
                        <div className={classes.contentSpacer}/>
                        {children}
                    </Fragment>
                )
            }</ActiveUser.Consumer>
        );
    }

    state = {
        open: false
    };

    static styles = theme => ({
        contentSpacer: {
            ...theme.mixins.toolbar
        },
        drawerPaper: {
            width: 300
        },
        menuButton: {
            marginLeft: -12,
            marginRight: theme.spacing(1)
        },
        toolbar: {
            alignItems: "center",
            display: "flex"
        }
    });
}

export default withStyles(Dashboard.styles)(withRouter(Dashboard));
