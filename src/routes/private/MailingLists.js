import {
    Divider,
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Fab,
    Grid,
    InputAdornment,
    Modal,
    Paper,
    Typography,
    withStyles
} from "@material-ui/core";
import {Add, ExpandMore} from "@material-ui/icons";
import firebase from "firebase/app";
import React, {Component} from "react";
import Dashboard from "../../components/Dashboard";
import Button from "../../components/Button";
import {withSnackbar} from "notistack";
import * as PropTypes from "prop-types";
import Input from "../../components/Input";

class MailingLists extends Component {
    componentDidMount() {
        this.unsubscribe =
            firebase.firestore().collection('mailing-lists')
                .onSnapshot(snapshot => {
                    this.setState({
                        aliases: snapshot.docs.map(doc => ({
                            ...doc.data(),
                            id: doc.id
                        }))
                    })
                });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    deleteMailingList = alias => () => {
        const deletionApproved = window.confirm(`Are you sure you want to delete the "${alias.name}" mailing list`);
        if (deletionApproved) {

            const enqueueSnackbar = this.props.enqueueSnackbar;
            firebase.firestore().doc(`mailing-lists/${alias.id}`).delete()
                .then(() => enqueueSnackbar(`Deleted the "${alias.name}" mailing list`))
                .catch(e => enqueueSnackbar(e.message))
        }
    };

    static propTypes = {
        classes: PropTypes.object.isRequired,
        enqueueSnackbar: PropTypes.func.isRequired
    };

    modelModalData = name => e => {
        this.setState({
            modal: {
                ...this.state.modal,
                data: {
                    ...this.state.modal.data,
                    [name]: e.target.value
                }
            }
        })
    };

    createMailingList = e => {
        e.preventDefault();
        firebase.firestore().collection('mailing-lists').add(this.state.modal.data)
            .then(() => this.props.enqueueSnackbar("Created mailing list"))
            .catch(e => this.props.enqueueSnackbar(e.message));
    };

    render() {
        const {classes} = this.props;
        const modal = this.state.modal.data;

        return (
            <Dashboard title={"Mailing Lists"}>
                <Grid container justify={"center"}>
                    {this.state.aliases.map(alias =>
                        <Grid item key={alias.id} xs={12} md={6}>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                                    <Typography>{alias.name}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <form style={{width: "100%"}}>
                                        <Input autoFocus label={"Name"} onChange={this.updateAliasField(alias, "name")}
                                               value={alias.name}/>
                                        <Input
                                            InputProps={{
                                                endAdornment: <InputAdornment
                                                    position={"end"}>@lynbrookrobotics.com</InputAdornment>
                                            }}
                                            onChange={this.updateAliasField(alias, "alias")}
                                            label={"Alias"} value={alias.alias}/>
                                        <Input
                                            onChange={this.updateAliasField(alias, "members")}
                                            multiline rowsMax={10} label={"Members"} value={alias.members}/>
                                    </form>
                                </ExpansionPanelDetails>
                                <Divider/>
                                <ExpansionPanelActions>
                                    <Button
                                        fullWidth={false}
                                        noMarginTop
                                        onClick={this.deleteMailingList(alias)}
                                        variant={"outlined"}
                                        size={"small"}>Delete Alias</Button>
                                    <Button
                                        fullWidth={false}
                                        noMarginTop
                                        onClick={() => {
                                            // noinspection JSUnusedLocalSymbols
                                            const {id, ...other} = alias;
                                            firebase.firestore().doc(`mailing-lists/${alias.id}`)
                                                .set({...other})
                                                .then(() => this.props.enqueueSnackbar(`Updated the "${alias.name}" mailing list`))
                                                .catch(e => this.props.enqueueSnackbar(e.message));
                                        }}
                                        size={"small"}>Save</Button>
                                </ExpansionPanelActions>
                            </ExpansionPanel>
                        </Grid>
                    )}
                </Grid>
                <Modal
                    open={this.state.modal.open}
                    onClose={() => this.setState({modal: {...this.state.modal, open: false}})}>
                    <Grid container alignItems={"center"} justify={"center"}>
                        <Grid item xs={12} md={6}>
                            <Paper className={classes.modalPaper}>
                                <Typography variant={"h6"}>New Alias</Typography>
                                <form onSubmit={this.createMailingList}>
                                    <Input autoFocus label={"Name"} onChange={this.modelModalData("name")}
                                           value={modal.name}/>
                                    <Input
                                        InputProps={{
                                            endAdornment: <InputAdornment
                                                position={"end"}>@lynbrookrobotics.com</InputAdornment>
                                        }}
                                        onChange={this.modelModalData("alias")}
                                        label={"Alias"} value={modal.alias}/>
                                    <Input
                                        onChange={this.modelModalData("members")}
                                        multiline rowsMax={10} label={"Members"} value={modal.members}/>
                                    <Button type={"submit"}>Create</Button>
                                </form>
                            </Paper>
                        </Grid>
                    </Grid>
                </Modal>
                <Fab className={classes.fab}
                     color={"primary"}
                     onClick={() => this.setState({modal: {...this.state.modal, open: true}})}>
                    <Add/>
                </Fab>
            </Dashboard>
        )
    }

    state = {
        aliases: [],
        modal: {
            data: {
                alias: Date.now(),
                name: "New Alias",
                members: ""
            },
            open: false
        }
    };

    static styles = theme => ({
        fab: {
            bottom: theme.spacing.unit * 2,
            right: theme.spacing.unit * 2,
            position: "fixed",
        },
        modalPaper: {
            padding: theme.spacing.unit * 2
        }
    });

    updateAliasField = (alias, field) => e => {
        const aliases = [].concat(this.state.aliases);
        aliases.find(it => it.id === alias.id)[field] = e.target.value;
        this.setState({
            aliases
        });
    };
}

export default withStyles(MailingLists.styles)(withSnackbar(MailingLists));