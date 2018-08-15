import React, {Component} from 'react';
import {Button, Grid} from '@material-ui/core';
import firebase from 'firebase/app';
import InputGrid from "../components/InputGrid";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import {levels} from "../settings";

class Profile extends Component {
    componentDidMount() {
        firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}`).onSnapshot(snapshot => {
            this.setState({
                data: Object.assign({
                    email: firebase.auth().currentUser.email,
                    level: levels.length - 1,
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
    }

    render() {
        return (
            <form onSubmit={this.updateProfile}>
                <Grid container justify={"center"}>
                    {this.state.fields.map(field => {
                        field = Object.assign({
                            label: "",
                            model: "",
                            options: [],
                            type: "input"
                        }, field);

                        let component = null;
                        switch (field.type) {
                            case 'phone':
                            case 'input':
                                component =
                                    <InputField
                                        label={field.label}
                                        onChange={e => this.setState({
                                            data: {...this.state.data, [field.model]: e.target.value}
                                        })}
                                        type={field.type}
                                        value={this.state.data[field.model] || ''}/>;
                                break;
                            case 'select':
                                component =
                                    <SelectField
                                        label={field.label}
                                        model={field.model}
                                        onChange={e => this.setState({
                                            data: {...this.state.data, [field.model]: e.target.value}
                                        })}
                                        options={field.options}
                                        value={this.state.data[field.model] || field.options[0]}/>;
                                break;
                            default:
                                component = null;
                                break;
                        } // Generate the component variable
                        return (
                            <InputGrid key={field.model}>
                                {component}
                            </InputGrid>
                        );
                    })}
                    <InputGrid>
                        <Button
                            disabled={this.state.updateButton.disabled}
                            fullWidth
                            type={"submit"}>
                            {this.state.updateButton.text}
                        </Button>
                    </InputGrid>
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