import React, {Component} from 'react';
import {Button, Grid} from '@material-ui/core';
import firebase from 'firebase/app';
import InputGrid from "../components/InputGrid";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import {levels} from "../settings";
import fields from '../fields';

class Profile extends Component {
    componentDidMount() {
        this.unsubscriber = firebase.firestore().doc(`users/${this.props.uid || firebase.auth().currentUser.uid}`).onSnapshot(snapshot => {
            this.setState({
                data: Object.assign({
                    email: firebase.auth().currentUser.email,
                    level: levels.length - 1,
                    uid: firebase.auth().currentUser.uid,
                }, snapshot.data())
            });
        });
    }

    componentWillUnmount() {
        this.unsubscriber();
    }

    constructor(props) {
        super(props);
        this.state = {
            data: {
                division: []
            },
            fields: fields,
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
                                        multiple={field.multiple}
                                        options={field.options}
                                        value={this.state.data[field.model] || (field.multiple ? [] : field.options[0])}/>;
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
                    {this.props.asAdmin && <InputGrid>
                        <SelectField
                            label={"Level"}
                            model={"level"}
                            onChange={e => this.setState({
                                data: {...this.state.data, level: levels.indexOf(e.target.value)}
                            })}
                            options={levels}
                            value={levels[this.state.data.level] || levels[levels.length - 1]}
                        />
                    </InputGrid>}
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
        firebase.firestore().doc(`users/${this.props.uid || firebase.auth().currentUser.uid}`).set(this.state.data)
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
