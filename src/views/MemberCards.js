import React, {Component} from 'react';
import {Grid, IconButton, Modal, Paper, Table, TableBody, TableCell, TableRow, Typography} from '@material-ui/core';
import './MemberCards.css';
import firebase from 'firebase/app'
import {ArrowBack, Home, Mail, Phone, Wc} from '@material-ui/icons';
import {levels} from "../settings";
import MemberCard from '../components/MemberCard';
import InputField from "../components/InputField";
import Profile from "./Profile";

class MemberCards extends Component {
    componentDidMount() {
        firebase.firestore().collection('users').onSnapshot(snapshot => {
            this.setState({
                users: snapshot.docs.map(doc => doc.data())
            });
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            allowEdits: false,
            editMode: false,
            modal: {
                open: false,
                uid: null
            },
            selectedUsers: [],
            users: []
        }
    }

    onEdit = uid => () => {
        this.setState({
            allowEdits: true,
            editMode: true,
            modal: {
                open: false,
                uid
            }
        });
    };

    openModal = uid => () => {
        this.setState({
            modal: {
                open: true,
                uid
            }
        })
    };

    onSelectClicked = uid => e => {
        const selected = this.state.selectedUsers.slice(0);
        if (e.target.checked) {
            selected.push(uid);
            this.setState({
                selectedUsers: selected
            });
        } else {
            selected.splice(selected.indexOf(uid), 1);
            this.setState({
                selectedUsers: selected
            });
        }
    };

    render() {
        let fields = [{
            left: <Mail/>,
            model: "email"
        }, {
            left: <Phone/>,
            model: "cell"
        }, {
            left: <Phone/>,
            model: "home"
        }, {
            left: <Home/>,
            model: "address",
        }, {
            left: <Wc/>,
            model: "gender"
        }, {
            left: "Division",
            model: "division"
        }, {
            left: "Role",
            model: "role"
        }];
        let user = this.state.users.find(user => user.uid === this.state.modal.uid);
        let currentUser = this.state.users.find(user => user.uid === firebase.auth().currentUser.uid) || {};

        return (
            <div className={"MemberCards"}>
                {!this.state.editMode &&
                <Grid container spacing={16}>
                    {this.state.users.map(user => <MemberCard
                        allowEdit={currentUser.level === levels.indexOf('Administrator')}
                        key={user.uid}
                        onEditClicked={this.onEdit(user.uid)}
                        onInfoClicked={this.openModal(user.uid)}
                        onChange={this.onSelectClicked(user.uid)}
                        selected={this.state.selectedUsers.indexOf(user.uid) !== -1}
                        user={user}/>)}
                </Grid>}
                {this.state.editMode &&
                <IconButton onClick={() => this.setState({editMode: false})}><ArrowBack/></IconButton>}
                {this.state.editMode && <Profile asAdmin={true} uid={this.state.modal.uid}/>}
                {this.state.modal.open === true && <Modal
                    onClose={() => this.setState({
                        modal: {
                            open: false,
                            uid: null
                        }
                    })}
                    open={this.state.modal.open}>
                    <Grid className={"modal-grid"} alignItems={"center"} container justify={"center"}>
                        <Grid item xs={11} md={6}>
                            <Paper className={"modal-paper"}>
                                <Typography variant={"headline"}>{user.name}</Typography>
                                <Table>
                                    <TableBody>
                                        {fields.map(value => {
                                            if (this.state.allowEdits) {
                                                return <TableRow>
                                                    <TableCell>{value.left}</TableCell>
                                                    <TableCell><InputField
                                                        label={value.model}
                                                        onChange={e => user[value.model] = e.target.value}
                                                        value={user[value.model]}/></TableCell>
                                                </TableRow>
                                            } else {
                                                return <TableRow>
                                                    <TableCell style={{
                                                        padding: "4px 2px 4px 24px"
                                                    }}>{value.left}</TableCell>
                                                    <TableCell style={{
                                                        paddingRight: "0"
                                                    }}><Typography>{user[value.model]}</Typography></TableCell>
                                                </TableRow>
                                            }
                                        })}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
                </Modal>}
            </div>
        );
    }
}

export default MemberCards;