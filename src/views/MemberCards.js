import React, {Component} from 'react';
import {
    Card,
    CardContent,
    Checkbox,
    Grid,
    IconButton,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@material-ui/core';
import './MemberCards.css';
import firebase from 'firebase/app'
import {Edit, Home, Info, Mail, Phone, Wc} from '@material-ui/icons';
import {levels} from "./settings";

class MemberCard extends Component {
    render() {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card>
                    <CardContent>
                        <Typography variant={"headline"}>{this.props.user.name} ({this.props.user.role})</Typography>
                        <Checkbox
                            checked={this.props.selected}
                            onChange={this.props.onChange}/>
                        <a href={`mailto:${this.props.user.email}`}>
                            <IconButton>
                                <Mail/>
                            </IconButton>
                        </a>
                        <a href={`tel:${this.props.user[this.props.user.phone === 'Cell Phone' ? 'cell' : 'home']}`}>
                            <IconButton>
                                <Phone/>
                            </IconButton>
                        </a>
                        <IconButton onClick={this.props.onInfoClicked}>
                            <Info/>
                        </IconButton>
                        {
                            this.props.allowEdit &&
                            <IconButton onClick={this.props.onEditClicked}>
                                <Edit/>
                            </IconButton>
                        }
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}

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
            allowEdits: true
        });
        this.openModal(uid)()   ;
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
        let user = this.state.users.find(user => user.uid === this.state.modal.uid);
        let currentUser = this.state.users.find(user => user.uid === firebase.auth().currentUser.uid) || {};

        return (
            <div className={"MemberCards"}>
                <Grid container spacing={16}>
                    {this.state.users.map(user => <MemberCard
                        allowEdit={currentUser.level === levels.indexOf('Administrator')}
                        key={user.uid}
                        onEditClicked={this.onEdit(user.uid)}
                        onInfoClicked={this.openModal(user.uid)}
                        onChange={this.onSelectClicked(user.uid)}
                        selected={this.state.selectedUsers.indexOf(user.uid) !== -1}
                        user={user}/>)}
                </Grid>
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
                                        <TableRow>
                                            <TableCell><Mail/></TableCell>
                                            <TableCell><Typography>{user.email}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><Phone/></TableCell>
                                            <TableCell><Typography>{user.cell}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><Phone/></TableCell>
                                            <TableCell><Typography>{user.home}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><Home/></TableCell>
                                            <TableCell><Typography>{user.address}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><Wc/></TableCell>
                                            <TableCell><Typography>{user.gender}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Division</TableCell>
                                            <TableCell><Typography>{user.division}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Role</TableCell>
                                            <TableCell><Typography>{user.role}</Typography></TableCell>
                                        </TableRow>
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