import Edit from "@material-ui/icons/Edit";
import Phone from '@material-ui/icons/Phone';
import Mail from '@material-ui/icons/Mail';
import React, {Component, Fragment} from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Hidden from "@material-ui/core/Hidden/Hidden";
import ActiveUser from "../contexts/ActiveUser";
import settings from "../settings";
import firebase from "firebase/app";
import FilterTools from "../components/FilterTools";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import {toTitleCase} from "../helpers";

class MemberCards extends Component {
    componentDidMount() {
        this.unsubscribe = firebase.firestore().collection('lite-users').onSnapshot(snapshot => {
            let users = snapshot.docs.map(doc => doc.data());
            this.setState({users: users});
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    constructor(props) {
        super(props);
        this.state = {
            filterBy: "any",
            filterText: "",
            users: []
        }
    }

    render() {
        const filteredUsers = this.state.users.slice(0).filter(user => {
            if (this.state.filterBy === "any") {
                return Object.values(user).join('|;|').toLowerCase().includes(this.state.filterText.toLowerCase());
            } else {
                return (user[this.state.filterBy] || this.state.filterText).toLowerCase().includes(this.state.filterText.toLowerCase());
            }
        }).slice(0, 25);

        return (
            <div style={{padding: 32}}>
                <FilterTools onChange={this.updateStateField("filterText")} value={this.state.filterText}
                             value1={this.state.filterBy} onChange1={this.updateStateField("filterBy")}
                             callbackfn={liteField => <MenuItem
                                 key={liteField}
                                 value={liteField}>
                                 {settings.fields.find(field => toTitleCase(field.label) === liteField).label}
                             </MenuItem>}/>
                <Grid container spacing={32}>
                    {
                        filteredUsers
                            .map(user => {
                                return (
                                    <Grid key={user.uid} item xs={12} md={4} lg={3}>
                                        <Card>
                                            <CardContent>
                                                <Typography
                                                    variant={"headline"}>{user.firstName} {user.lastName}</Typography>
                                                <Checkbox/>
                                                <Hidden mdUp>
                                                    {user.primaryPhoneNumber && user.primaryPhoneNumber !== "" &&
                                                    <IconButton
                                                        onClick={() => window.open(`tel:${user.primaryPhoneNumber}`)}>
                                                        <Phone/>
                                                    </IconButton>}
                                                    <Fragment/>
                                                </Hidden>
                                                {user.emailAddress && user.emailAddress !== "" &&
                                                <IconButton onClick={() => window.open(`mailto:${user.emailAddress}`)}>
                                                    <Mail/>
                                                </IconButton>}
                                                <ActiveUser.Consumer>
                                                    {user => <Fragment>
                                                        {settings.permissionLevels[user.permissionLevel] &&
                                                        <IconButton><Edit/></IconButton>}
                                                    </Fragment>}
                                                </ActiveUser.Consumer>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            })
                    }
                </Grid>
            </div>
        );
    }

    updateStateField = field => e => {
        this.setState({[field]: e.target.value});
    }
}

export default MemberCards;