import Button from "../../components/Button";
import Dashboard from "../../components/Dashboard";
import firebase from "firebase/app";
import {Grid, Paper, withStyles} from "@material-ui/core";
import Input from "../../components/Input";
import React, {Component} from "react";
import {userProfileFields} from "../../settings";
import Typography from "@material-ui/core/es/Typography/Typography";
import {withSnackbar} from "notistack";
import * as PropTypes from "prop-types";

class ProfileEditor extends Component {
    componentDidMount() {
        firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}`).onSnapshot(snapshot => {
            this.setState({
                profile: snapshot.data() || this.state.profile
            });
        });
    }

    generateInputFromUserProfileField = userProfileField => {
        const profile = this.state.profile;

        const {condition, key, type, ...props} = userProfileField;

        if (!condition(profile)) return null;

        if (type === "multi-input-field") {
            return (
                <div key={key}>
                    <Typography variant={"h6"}>{userProfileField.label}</Typography>
                    <Grid container spacing={8}>
                        {userProfileField.content
                            .map(inputDescriptor => (
                                <Grid key={inputDescriptor.key} item xs={12 / userProfileField.content.length}>
                                    {this.generateInputFromUserProfileField(inputDescriptor)}
                                </Grid>
                            ))}
                    </Grid>
                </div>
            );
        } else if (type === "group") {
            return (
                <div key={key}>
                    <Typography variant={"h6"}>{userProfileField.label}</Typography>
                    {userProfileField.content.map(this.generateInputFromUserProfileField)}
                </div>
            );
        } else {
            return (
                <Input
                    key={key}
                    onChange={this.onProfileFieldChange(key)}
                    type={type}
                    value={profile[key] || ""}
                    {...props}/>
            );
        }
    };

    onProfileFieldChange = name => e => {
        this.setState({
            profile: {
                ...this.state.profile,
                [name]: e.target.value
            }
        })
    };

    static propTypes = {
        classes: PropTypes.object.isRequired,
        enqueueSnackbar: PropTypes.func.isRequired
    };

    render() {
        const {classes} = this.props;

        return (
            <Dashboard title="Profile Editor">
                <Grid container justify="center">
                    <Grid item xs={12} md={8} lg={6}>
                        <Paper className={classes.paper}>
                            <form onSubmit={this.updateProfile}>
                                {userProfileFields.map(this.generateInputFromUserProfileField)}
                                <Button type="submit">Update my profile</Button>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Dashboard>
        );
    }

    state = (() => {
        const {currentUser} = firebase.auth();
        return {profile: {
            "Backup Phone Type": "Home",
            Email: currentUser.email,
            Gender: "Male",
            Name: currentUser.displayName,
            "Primary Phone Number": "(408) 480-2845",
            "Primary Phone Type": "Cell",
            Role: "Student",
            Teams: [],
        }};
    })();

    static styles = theme => ({
        paper: {
            padding: theme.spacing.unit * 2
        }
    });

    updateProfile = e => {
        const {enqueueSnackbar} = this.props;
        e.preventDefault();
        firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}`)
            .set(this.state.profile)
            .then(() => enqueueSnackbar("Updated profile"))
            .catch(e => enqueueSnackbar(e.message, {
                variant: "error"
            }));
    }
}

export default withStyles(ProfileEditor.styles)(withSnackbar(ProfileEditor));