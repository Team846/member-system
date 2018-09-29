import firebase from 'firebase/app';
import React, {Component} from 'react';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import {model} from '../helpers';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "Change",
            email: String(),
            currentPassword: String(),
            newPassword: String(),
            confirmPassword: String()
        }
    }


    render() {
        return (
            <form onSubmit={e => {
                e.preventDefault();
                firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(firebase.auth.EmailAuthProvider.credential(
                    firebase.auth().currentUser.email, this.state.currentPassword))
                    .then(() => {
                        if (this.state.newPassword !== this.state.confirmPassword) {
                            this.setState({buttonText: "Wrong confirmation"});
                            return;
                        }
                        firebase.auth().currentUser.updatePassword(this.state.newPassword)
                            .then(() => this.setState({buttonText: "Changed"}))
                            .catch(() => this.setState({buttonText: "Failed"}))
                    })
                    .catch(() => {
                        this.setState({buttonText: "Wrong password"})
                    });
            }}>
                <input autoComplete={"username"} type={"hidden"} value={firebase.auth().currentUser.email}/>
                <TextField
                    {...model.call(this, "currentPassword")}
                    autoComplete={"current-password"}
                    fullWidth
                    label={"Current Password"}
                    margin={"normal"}
                    type={"password"}/>
                <TextField
                    {...model.call(this, "newPassword")}
                    autoComplete={"new-password"}
                    fullWidth
                    label={"New Password"}
                    margin={"normal"}
                    type={"password"}/>
                <TextField
                    {...model.call(this, "confirmPassword")}
                    fullWidth
                    autoComplete={"new-password"}
                    label={"Retype Password"}
                    margin={"normal"}
                    type={"password"}/>
                <Button color={"primary"} variant={"raised"} type={"submit"}>{this.state.buttonText}</Button>
            </form>
        );
    }
}

export default ChangePassword;