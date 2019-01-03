import Button from "../../components/Button";
import Dashboard from "../../components/Dashboard";
import firebase from "firebase/app";
import {Grid, Paper, withStyles} from "@material-ui/core";
import Input from "../../components/Input";
import React, {Component} from "react";
import {userProfileFields} from "../../settings";
import Typography from "@material-ui/core/es/Typography/Typography";

class ProfileEditor extends Component {
    generateInputFromUserProfileField = userProfileField => {
        const {currentUser} = firebase.auth();
        const profile = {
            Email: currentUser.email,
            Name: currentUser.displayName,
            "Primary Phone Number": "(408) 480-2845",
            "Primary Phone Type": "Cell",
            ...this.state.profile
        };

        if (userProfileField.type === "multi-input-field") {
            return (
                <div key={userProfileField.key}>
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
        } else {
            return (
                <Input
                    key={userProfileField.key}
                    value={profile[userProfileField.key]}
                    {...userProfileField}/>
            );
        }
    };

    render() {
        const {classes} = this.props;

        return (
            <Dashboard title="Profile Editor">
                <Grid container justify="center">
                    <Grid item xs={12} md={8} lg={6}>
                        <Paper className={classes.paper}>
                            <form>
                                {userProfileFields.map(this.generateInputFromUserProfileField)}
                                <Button type="submit">Update my profile</Button>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Dashboard>
        );
    }

    state = {
        profile: {}
    };

    static styles = theme => ({
        paper: {
            padding: theme.spacing.unit * 2
        }
    });
}

export default withStyles(ProfileEditor.styles)(ProfileEditor);