import React, {Component} from 'react';
import './MemberCards.css';
import {
    Card,
    CardContent,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography
} from '@material-ui/core';
import {Mail, Phone} from '@material-ui/icons';

class MemberCard extends Component {
    render() {
        return (
            <Grid item xs={12} md={4} lg={3}>
                <Card>
                    <CardContent onClick={this.props.onClick}>
                        <Typography variant={"headline"}>
                            {this.props.user.name}
                        </Typography>
                        <Typography variant={"subheading"}>
                            {this.props.user.team.toUpperCase()} ({this.props.user.graduation || ''})
                        </Typography>
                        <Table>
                            <TableBody className={"card-body"}>
                                <TableRow>
                                    <TableCell><Mail/></TableCell>
                                    <TableCell>
                                        <a href={`mailto:${this.props.user.email}`}>{this.props.user.email}</a>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Phone/></TableCell>
                                    <TableCell className={this.props.user.primary === "cell" ? "bold" : ""}>
                                        <a href={`tel:${this.props.user.cell}`}>Cell: {this.props.user.cell}</a>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Phone/></TableCell>
                                    <TableCell className={this.props.user.primary === "home" ? "bold" : ""}>
                                        <a href={`tel:${this.props.user.home}`}>Home: {this.props.user.home}</a>
                                    </TableCell>
                                </TableRow>
                                {/*<TableRow>*/}
                                {/*<TableCell><Home/></TableCell>*/}
                                {/*<TableCell>*/}
                                {/*<a*/}
                                {/*href={`https://google.com/maps/search/${this.props.user.address}`}>*/}
                                {/*{this.props.user.address}, CA 95129</a>*/}
                                {/*</TableCell>*/}
                                {/*</TableRow>*/}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}

export default class MemberCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: '',
            'filter-by': 'any',
            modalOpen: false,
            user: null
        };

        class SyncedTextField extends Component {
            onChange(event) {
                this.memberCards.setState({
                    [this.props.name]: event.target.value
                });
            };

            memberCards = this;

            render() {
                return <TextField
                    fullWidth
                    margin={"dense"}
                    {...this.props}
                    onChange={this.onChange.bind(this)}
                    value={this.memberCards.state[this.props.name] || ''}/>;
            }
        }

        class SyncedSelect extends Component {
            onChange(event) {
                this.memberCards.setState({
                    [this.props.name]: event.target.value
                });
            }

            memberCards = this;

            render() {
                return <FormControl fullWidth margin={"dense"}>
                    <InputLabel htmlFor={this.props.name}>{this.props.label}</InputLabel>
                    <Select
                        inputProps={{
                            id: this.props.name
                        }}
                        onChange={this.onChange.bind(this)}
                        value={this.memberCards.state[this.props.name] || ''}>
                        {this.props.children}
                    </Select>
                </FormControl>;
            }
        }

        this.SyncedSelect = SyncedSelect;
        this.SyncedTextField = SyncedTextField;
    }

    closeModal = () => {
        this.setState({
            modalOpen: false,
            user: null
        });
    };

    onCardClicked = user => () => {
        this.setState({
            modalOpen: true,
            user
        });
    };

    render() {
        const {SyncedSelect, SyncedTextField} = this;

        return (
            <div className={"MemberCards"}>
                <Grid container spacing={8}>
                    <Grid item xs={12} md={3}>
                        <SyncedSelect
                            label={"Filter By"}
                            name={"filter-by"}>
                            <MenuItem value={"any"}>Any</MenuItem>
                            <MenuItem value={"name"}>Name</MenuItem>
                            <MenuItem value={"gender"}>Gender</MenuItem>
                            <MenuItem value={"email"}>Email</MenuItem>
                            <MenuItem value={"team"}>Team</MenuItem>
                            <MenuItem value={"role"}>Role</MenuItem>
                            <MenuItem value={"graduation"}>Graduation Year</MenuItem>
                        </SyncedSelect>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <SyncedTextField
                            label={"Filter Text"}
                            name={"filter"}/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <IconButton className={"icon"}>

                        </IconButton>
                    </Grid>
                </Grid>
                <Grid className={"cards"} container spacing={16}>
                    {this.props.users
                        .filter(user => {
                            if (this.state['filter-by'] === 'any') {
                                return Object.keys(user)
                                    .filter(key => ['uid', 'cell', 'home'].indexOf(key) === -1)
                                    .map(key => user[key])
                                    .some(value => String(value).includes(this.state.filter));
                            } else {
                                return user[this.state['filter-by']].includes(this.state.filter)
                            }
                        })
                        .map(user => <MemberCard key={user.uid} onClick={this.onCardClicked(user)} user={user}/>)}
                </Grid>
                {this.state.user && <Modal
                    onClose={this.closeModal}
                    open={this.state.modalOpen}>
                    <Grid alignItems={"center"} container justify={"center"} className={"backdrop-grid"}>
                        <Grid item xs={11} md={6}>
                            <Paper className={"details"}>
                                <Typography variant={"title"}>{this.state.user.name}</Typography>
                                <Table>
                                    <TableBody>
                                        {Object.keys(this.state.user)
                                            .filter(key => ['photoURL', 'uid'].indexOf(key) === -1)
                                            .map(key => {
                                                return {
                                                    key: key,
                                                    value: String(this.state.user[key])
                                                }
                                            })
                                            .map(set => <TableRow>
                                                <TableCell>{set.key}</TableCell>
                                                <TableCell>{set.value}</TableCell>
                                            </TableRow>)}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
                </Modal>}
            </div>
        )
    }
}
