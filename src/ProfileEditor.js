import React, {Component} from 'react';
import {Button, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField} from '@material-ui/core';
import './ProfileEditor.css';
import InputMask from 'react-input-mask';
import firebase from 'firebase/app';

export default class ProfileEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.users.find(user => user.uid === this.props.user.uid) || {
                email: this.props.user.email,
                photoURL: this.props.user.photoURL,
                role: 'other',
                uid: this.props.user.uid
            },
            updateButton: {
                disabled: false,
                text: "Update"
            }
        };

        class SyncedSelect extends Component {
            onChange(event) {
                this.profileEditor.setState({
                    data: {
                        ...this.profileEditor.state.data,
                        [this.props.name]: event.target.value
                    }
                });
            }

            profileEditor = this;

            render() {
                const control = <FormControl fullWidth margin={"dense"}>
                    <InputLabel htmlFor={this.props.name}>{this.props.label}</InputLabel>
                    <Select
                        inputProps={{
                            id: this.props.name
                        }}
                        onChange={this.onChange.bind(this)}
                        value={this.profileEditor.state.data[this.props.name] || ''}>
                        {this.props.children}
                    </Select>
                </FormControl>;
                return this.props.noGrid ? control : <Grid item xs={11} md={3}>
                    {control}
                </Grid>
            }
        }

        class SyncedTextField extends Component {
            onChange(event) {
                this.profileEditor.setState({
                    data: {
                        ...this.profileEditor.state.data,
                        [this.props.name]: event.target.value
                    }
                })
                ;
            };

            profileEditor = this;

            render() {
                const {noGrid, ...props} = this.props;

                const field = <TextField
                    fullWidth
                    margin={"dense"}
                    {...props}
                    onChange={this.onChange.bind(this)}
                    value={this.profileEditor.state.data[this.props.name] || ''}/>;
                return noGrid ? field : <Grid item xs={11} md={3}>
                    {field}
                </Grid>;
            }
        }

        this.SyncedSelect = SyncedSelect;
        this.SyncedTextField = SyncedTextField;
    }


    onProfileUpdated = () => {
        this.setState({
            updateButton: {
                disabled: true,
                text: "Updated"
            }
        });
        setTimeout(this.resetUpdateButton, 1000);
    };

    onProfileFailedToUpdate = reason => {
        this.setState({
            updateButton: {
                disabled: true,
                text: reason
            }
        });
        setTimeout(this.resetUpdateButton, 1000);
    };

    onUpdateClicked = () => {
        this.setState({
            updateButton: {
                disabled: true,
                text: "Updating"
            }
        });
        firebase.firestore().doc(`users/${this.props.user.uid}`).set(this.state.data)
            .then(this.onProfileUpdated)
            .catch(this.onProfileFailedToUpdate);
    };

    PhoneNumberInput = class PhoneNumberInput extends Component {
        render() {
            return (
                <InputMask
                    {...this.props}
                    alwaysShowMask={true}
                    mask={"(999) 999-9999"}
                    maskChar={"#"}/>
            )
        }
    };

    phoneNumberInputProps = {
        inputComponent: this.PhoneNumberInput,
        startAdornment: <InputAdornment position={"start"}>+1</InputAdornment>
    };

    preventSubmission = e => {
        e.preventDefault();
    };

    resetUpdateButton = () => {
        this.setState({
            updateButton: {
                disabled: false,
                text: "Update"
            }
        })
    };

    render() {
        const {SyncedTextField, SyncedSelect} = this;
        return (
            <form className={"ProfileEditor"} onSubmit={this.preventSubmission}>
                <Grid container spacing={32}>
                    <SyncedTextField
                        label={"Name"}
                        name={"name"}/>
                    <SyncedTextField
                        label={"Email"}
                        name={"email"}/>
                    <SyncedTextField
                        InputProps={this.phoneNumberInputProps}
                        label={"Cell Phone Number"}
                        name={"cell"}/>
                    <SyncedTextField
                        InputProps={this.phoneNumberInputProps}
                        label={"Home Phone Number"}
                        name={"home"}/>
                    <SyncedSelect
                        label={"Primary Phone Number"}
                        name={"primary"}>
                        <MenuItem value={"cell"}>Cell Phone</MenuItem>
                        <MenuItem value={"home"}>Home Phone</MenuItem>
                    </SyncedSelect>
                    <SyncedTextField
                        label={"Address"}
                        name={"address"}
                        placeholder={"1280 Johnson Ave, San Jose"}/>
                    <SyncedSelect
                        label={"Gender"}
                        name={"gender"}>
                        <MenuItem value={"male"}>Male</MenuItem>
                        <MenuItem value={"female"}>Female</MenuItem>
                        <MenuItem value={"other"}>Other</MenuItem>
                    </SyncedSelect>
                    <SyncedSelect
                        label={"Team"}
                        name={"team"}>
                        <MenuItem value={"hardware"}>Hardware</MenuItem>
                        <MenuItem value={"software"}>Software</MenuItem>
                        <MenuItem value={"design"}>Design</MenuItem>
                        <MenuItem value={"modelling"}>Modelling</MenuItem>
                        <MenuItem value={"administration"}>Administration</MenuItem>
                    </SyncedSelect>
                    <SyncedSelect
                        label={"Role"}
                        name={"role"}>
                        <MenuItem value={"mentor"}>Mentor</MenuItem>
                        <MenuItem value={"student"}>Student</MenuItem>
                        <MenuItem value={"parent"}>Parent</MenuItem>
                        <MenuItem value={"other"}>Other</MenuItem>
                    </SyncedSelect>
                    {this.state.data['role'] === 'student' &&
                    <Grid item xs={11} md={3}>
                        <SyncedSelect
                            label={"Graduation Year"}
                            name={"graduation"}
                            noGrid>
                            {[...Array(5)]
                                .map((_, i) => new Date().getFullYear() + i)
                                .map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
                        </SyncedSelect>
                    </Grid>}
                    {(this.state.data['role'] === 'mentor' || this.state.data['role'] === 'parent') &&
                    <Grid item xs={11} md={3}>
                        <SyncedSelect
                            label={"Employment Status"}
                            name={"employment"}
                            noGrid>
                            <MenuItem value={"unemployed"}>Unemployed</MenuItem>
                            <MenuItem value={"part-time"}>Part Time</MenuItem>
                            <MenuItem value={"full-time"}>Full Time</MenuItem>
                        </SyncedSelect>
                        {this.state.data['employment'] !== 'unemployed' &&
                        <SyncedTextField
                            label={"Employer"}
                            name={"employer"}
                            noGrid/>}
                    </Grid>}
                    <Grid item xs={11} md={3}>
                        <Button
                            className={"submit-button"}
                            disabled={this.state.updateButton.disabled}
                            fullWidth
                            onClick={this.onUpdateClicked}
                            type={"submit"}>
                            {this.state.updateButton.text}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}
