import React, {Component} from 'react';
import {Grid, IconButton, Modal, Paper, Table, TableBody, TableCell, TableRow, Typography} from '@material-ui/core';
import './MemberCards.css';
import firebase from 'firebase/app'
import {ArrowBack, Home, Mail, Phone, Wc} from '@material-ui/icons';
import {levels} from "../settings";
import MemberCard from '../components/MemberCard';
import InputField from "../components/InputField";
import Profile from "./Profile";
import SelectField from "../components/SelectField";

class MemberCards extends Component {
    componentDidMount() {
        this.subscriber = firebase.firestore().collection('users').onSnapshot(snapshot => {
            this.setState({
                users: snapshot.docs.map(doc => doc.data())
            });
        });
    }

    componentWillUnmount() {
        this.subscriber();
    }

    constructor(props) {
        super(props);
        this.state = {
            allowEdits: false,
            editMode: false,
            filterBy: this.filters[0],
            filterText: "",
            modal: {
                open: false,
                uid: null
            },
            selectedUsers: [],
            users: []
        }
    }

    filters = [{
        filter: user => {
            return Object.values(user).some(it => String(it).includes(this.state.filterText));
        },
        name: "All",
        type: "function"
    }, {
        map: "name",
        name: "Name",
    }, {
        map: "email",
        name: "Email"
    }, {
        filter: user => {
            return user.division.join(', ').includes(this.state.filterText);
        },
        name: "Division",
        type: "function"
    }, {
        map: "gender",
        name: "Gender"
    }, {
        map: "role",
        name: "Role"
    }, {
        filter: user => {
            return levels[user.level].includes(this.state.filterText);
        },
        name: "Level",
        type: "function"
    }];

    onEdit = uid => () => {
        this.setState({
            // allowEdits: true,
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
            model: "division",
            transform: value => value.join(', ')
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
                    <Grid item xs={12} md={6}>
                        <SelectField
                            label={"Filter By"}
                            model={"filter-by"}
                            onChange={e => this.setState({
                                filterBy: this.filters.find(value => value.name === e.target.value)
                            })}
                            options={this.filters.map(it => it.name)}
                            value={this.state.filterBy.name}/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputField
                            label={"Filter Text"}
                            onChange={e => this.setState({filterText: e.target.value})}
                            value={this.state.filterText}/>
                    </Grid>
                    {this.state.users.length === 0 && <Typography variant={"display1"}>No members   </Typography>}
                    {this.state.users
                        .filter(user => {
                            if (this.state.filterBy.type === 'function') {
                                return this.state.filterBy.filter(user);
                            } else {
                                return String(user[this.state.filterBy.map]).includes(this.state.filterText);
                            }
                        })
                        .map(user => <MemberCard
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
                                                    }}><Typography>{(value.transform || (value => value))(user[value.model])}</Typography></TableCell>
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