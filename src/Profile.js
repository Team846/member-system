import React, {Component} from 'react';
import {Button, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField} from '@material-ui/core';
import InputMask from 'react-input-mask';
import firebase from 'firebase/app';

class Profile extends Component {
    componentDidMount() {
        firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}`).onSnapshot(snapshot => {
            this.setState({
                data: Object.assign({
                    email: firebase.auth().currentUser.email,
                    uid: firebase.auth().currentUser.uid,
                }, snapshot.data())
            });
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            fields: [{
                label: "Name",
                model: "name"
            }, {
                label: "Email",
                model: "email"
            }, {
                label: "Cell Phone Number",
                model: "cell",
                type: "phone"
            }, {
                label: "Home Phone Number",
                model: "home",
                type: "phone"
            }, {
                label: "Preferred Phone Number",
                model: "phone",
                options: ["Home Phone", "Cell Phone"],
                type: "select"
            }, {
                label: "Address",
                model: "address"
            }, {
                label: "Gender",
                model: "gender",
                options: ["Male", "Female", "Other"],
                type: "select"
            }, {
                label: "Division",
                model: "division",
                options: ["Animation", "Design", "Electrical", "Hardware", "Software"],
                type: 'select'
            }, {
                label: "Role",
                model: "role",
                options: ["Adult", "Mentor", "Other", "Student"],
                type: 'select'
            }],
            updateButton: {
                disabled: false,
                text: "Update"
            }
        };

        class PhoneInput extends Component {
            render() {
                return (
                    <InputMask {...this.props} alwaysShowMask mask={"(999) 999-9999"} maskChar={"#"}/>
                );
            }
        }

        class ProfileGrid extends Component {
            render() {
                return (
                    <Grid item xs={11} md={7}>
                        {this.props.children}
                    </Grid>
                );
            }
        }

        this.PhoneInput = PhoneInput;
        // noinspection JSUnusedGlobalSymbols
        this.ProfileGrid = ProfileGrid;
    }

    render() {
        return (
            <form onSubmit={this.updateProfile}>
                <Grid container justify={"center"}>
                    {this.state.fields.map(field => {
                        const
                            filledField = Object.assign({
                                label: "",
                                model: "",
                                options: [],
                                type: "input"
                            }, field),
                            phoneProps = {
                                inputComponent: this.PhoneInput,
                                startAdornment: <InputAdornment position={"start"}>+1</InputAdornment>
                            };
                        let component = null;
                        switch (filledField.type) {
                            case 'phone':
                            case 'input':
                                // noinspection JSValidateTypes
                                component =
                                    <TextField
                                        fullWidth
                                        InputProps={filledField.type === "phone" ? phoneProps : undefined}
                                        label={filledField.label}
                                        margin={"dense"}
                                        onChange={e => this.setState({
                                            data: {...this.state.data, [filledField.model]: e.target.value}
                                        })}
                                        value={this.state.data[filledField.model] || ''}/>;
                                break;
                            case 'select':
                                component =
                                    <FormControl fullWidth margin={"dense"}>
                                        <InputLabel htmlFor={filledField.model}>{filledField.label}</InputLabel>
                                        <Select
                                            inputProps={{
                                                id: filledField.model
                                            }}
                                            onChange={e => this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    [filledField.model]: e.target.value
                                                }
                                            })}
                                            value={this.state.data[filledField.model] || filledField.options[0]}>
                                            {filledField.options.map(option =>
                                                <MenuItem key={option} value={option}>{option}</MenuItem>)}
                                        </Select>
                                    </FormControl>;
                                break;
                            default:
                                component = null;
                                break;
                        } // Generate the component variable
                        return (
                            <this.ProfileGrid key={filledField.model}>
                                {component}
                            </this.ProfileGrid>
                        );
                    })}
                    <this.ProfileGrid>
                        <Button
                            disabled={this.state.updateButton.disabled}
                            fullWidth
                            type={"submit"}>
                            {this.state.updateButton.text}
                        </Button>
                    </this.ProfileGrid>
                </Grid>
            </form>
        );
    }

    scheduleUpdateButtonReset = () => {
        setTimeout(() => {
            this.setState({
                updateButton: {
                    disabled: false,
                    text: "Update"
                }
            })
        }, 1000);
    };

    updateProfile = e => {
        e.preventDefault();
        this.setState({
            updateButton: {
                disabled: true,
                text: "Updating..."
            }
        });
        firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}`).set(this.state.data)
            .then(() => {
                this.setState({
                    updateButton: {
                        disabled: true,
                        text: "Updated"
                    }
                });
                this.scheduleUpdateButtonReset();
            })
            .catch(reason => {
                this.setState({
                    updateButton: {
                        disabled: true,
                        text: "Failed"
                    }
                });
                this.scheduleUpdateButtonReset();
                console.error(reason);
            });
    }
}

export default Profile;