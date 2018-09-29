import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid/Grid";
import settings from "../settings";
import {toTitleCase} from "../helpers";
import TextField from "@material-ui/core/TextField/TextField";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import firebase from "firebase/app";
import Button from "@material-ui/core/Button/Button";
import ActiveUser from "../contexts/ActiveUser";

class ProfileEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false,
            buttonText: "Update",
            profile: settings.defaultProfile
        };
    }

    componentDidMount() {
        this.unsubscribe = firebase.firestore().doc(`users/${this.props.uid || firebase.auth().currentUser.uid}`)
            .onSnapshot(snapshot => {
                const newProfile = Object.assign({}, this.state.profile);
                this.setState({profile: Object.assign(newProfile, snapshot.data())});
            });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const {profile} = this.state;


        const createComponentFromField = field => {
            let component = null;
            // noinspection JSUnusedLocalSymbols
            const {condition, model, ...filtered} = field;
            switch (field.type) {
                case 'select':
                    component = (
                        <FormControl fullWidth margin={"dense"}>
                            <InputLabel htmlFor={field.model}>{field.label}</InputLabel>
                            <Select
                                {...filtered}
                                inputProps={{id: field.model}}
                                onChange={this.updateLocalProfile(model)}
                                value={profile[model]}>
                                {field.options
                                    .map(option => <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>)}
                            </Select>
                        </FormControl>
                    );
                    break;
                default:
                    component = (
                        <TextField
                            {...filtered}
                            fullWidth
                            margin={"dense"}
                            onChange={this.updateLocalProfile(model)}
                            value={profile[model]}/>)
            }
            return ProfileEditor.wrapWithGrid(component, field.label);
        };
        return (
            <Grid justify={"center"} container>
                {
                    settings.fields
                        .map(field => Object.assign({}, settings.defaultField, {
                            model: toTitleCase(field.label)
                        }, field))
                        .filter(field => field.condition(profile))
                        .map(createComponentFromField)
                }
                <ActiveUser.Consumer>
                    {activeUser => {
                        if (settings.permissionLevels.indexOf(activeUser.permissionLevel) >= settings.permissionLevels.indexOf("Officer")) {
                            return <Fragment>
                                {
                                    settings.officerFields
                                        .map(field => Object.assign({}, settings.defaultField, {
                                            model: toTitleCase(field.label)
                                        }, field))
                                        .map(createComponentFromField)
                                }
                            </Fragment>
                        } else return null;
                    }}
                </ActiveUser.Consumer>
                {ProfileEditor.wrapWithGrid(<Button disabled={this.state.buttonDisabled}
                                                    fullWidth
                                                    onClick={this.updateRemoteProfile}
                                                    variant={"raised"}>{this.state.buttonText}</Button>)}
            </Grid>
        );
    }

    updateRemoteProfile = () => {
        const updateButton = (text, disabled) => {
            this.setState({buttonDisabled: disabled !== undefined ? disabled : true, buttonText: text})
        };

        const scheduleButtonReset = () => {
            setTimeout(updateButton, 1000, "Update", false);
        };

        updateButton("Updating...");
        let effectiveUID = this.props.uid || firebase.auth().currentUser.uid;
        firebase.firestore().doc(`users/${effectiveUID}`)
            .set({...this.state.profile, uid: effectiveUID})
            .then(() => {
                const {profile} = this.state;
                const liteProfile = {};
                for (let i = 0; i < settings.liteFields.length; i++) {
                    liteProfile[settings.liteFields[i]] = profile[settings.liteFields[i]];
                }
                liteProfile.uid = effectiveUID;
                firebase.firestore().doc(`lite-users/${effectiveUID}`)
                    .set(liteProfile)
                    .then(() => {
                        updateButton("Updated");
                        scheduleButtonReset();
                    });
            })
            .catch(e => {
                updateButton("Failed");
                scheduleButtonReset();
                console.error(e);
            });
    };

    updateLocalProfile = model => e => {
        this.setState({profile: {...this.state.profile, [model]: e.target.value}});
    };

    static wrapWithGrid = (component, key) => <Grid item key={key} xs={11} md={7}>{component}</Grid>;
}

ProfileEditor.propTypes = {
    classes: PropTypes.object.isRequired,
    uid: PropTypes.string
};

ProfileEditor.styles = {};

export default withStyles(ProfileEditor.styles)(ProfileEditor);