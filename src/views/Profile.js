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
                    division: [],
                    gender: "Male",
                    graduation: String(new Date().getFullYear()),
                    level: 1,
                    role: "Other",
                    uid: firebase.auth().currentUser.uid
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
        let studentFields = [{
            label: "Graduation Year",
            model: "graduation",
            options: [...Array(5)].map((_, i) => String(new Date().getFullYear() + i)),
            type: "select"
        }];
        let studentAndMentorFields = [{
            label: "Division(s)",
            model: "division",
            multiple: true,
            options: ["Animation", "Design", "Electrical", "Hardware", "Software"],
            type: 'select'
        }];
        let adultFields = [{
            label: "Employer",
            model: "employer"
        }];
        let inputBuilder = field => {
            let component = this.createComponentFrom(field);
            return (
                <InputGrid key={field.model}>
                    {component}
                </InputGrid>
            );
        };
        return (
            <form onSubmit={this.updateProfile}>
                <Grid container justify={"center"}>
                    {this.state.fields.map(inputBuilder)}
                    {this.state.data.role === 'Student' && studentFields.map(inputBuilder)}
                    {["Adult", "Mentor"].indexOf(this.state.data.role) !== -1 && adultFields.map(inputBuilder)}
                    {["Student", "Mentor"].indexOf(this.state.data.role) !== -1 && studentAndMentorFields.map(inputBuilder)}
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

    createComponentFrom(field) {
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
        return component;
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
