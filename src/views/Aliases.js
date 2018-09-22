import React, {Component} from 'react';
import firebase from 'firebase/app';
import Button from "@material-ui/core/Button/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import TextField from "@material-ui/core/TextField/TextField";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import settings from "../settings";
import {toTitleCase} from "../helpers";
import Grid from "@material-ui/core/Grid/Grid";

class Aliases extends Component {
    componentDidMount() {
        this.unsubscriber = firebase.firestore().collection('aliases').onSnapshot(snapshot => {
            this.setState({
                aliases: snapshot.docs.map(doc => ({...doc.data(), edited: false, id: doc.id}))
            });
        });
    }

    componentWillUnmount() {
        this.unsubscriber();
    }

    constructor(props) {
        super(props);
        this.state = {
            aliases: []
        }
    }

    addFilterToAlias = aliasId => {
        const aliases = this.state.aliases.slice(0);
        const alias = aliases.find(alias => alias.id === aliasId);
        alias.filters.push({by: "role", value: "", id: Date.now()});
        alias.edited = true;
        this.setState({aliases});
    };

    editFilterFieldForAlias = (aliasId, filterId, filterField) => e => {
        const aliases = this.state.aliases.slice(0);
        const alias = aliases.find(alias => alias.id === aliasId);
        alias.edited = true;
        alias.filters.find(filter => filter.id === filterId)[filterField] = e.target.value;
        this.setState({aliases});
    };

    updateAliasState = aliasId => field => e => {
        const aliases = this.state.aliases.slice(0);
        aliases[aliases.findIndex(alias => alias.id === aliasId)] = {
            ...aliases.find(alias => alias.id === aliasId), [field]: e.target.value, edited: true
        };
        this.setState({aliases});
    };

    render() {
        return (
            <div style={{margin: 16}}>
                {this.state.aliases.map(alias =>
                    <ExpansionPanel key={alias.id}>
                        <ExpansionPanelSummary>
                            <Typography>{alias.name}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{display: "block"}}>
                            <TextField
                                fullWidth
                                margin={"dense"}
                                onChange={this.updateAliasState(alias.id)("name")}
                                label={"Alias Name"}
                                value={alias.name}/>
                            <TextField
                                fullWidth
                                margin={"dense"}
                                onChange={this.updateAliasState(alias.id)("alias")}
                                label={"Alias"}
                                value={alias.alias}/>
                            {alias.filters.map(filter =>
                                <div key={filter.id} style={{padding: 16}}>
                                    <Grid container spacing={16}>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth margin={"dense"}>
                                                <InputLabel htmlFor={`${alias.id}-${filter.by}-${filter.value}`}>Filter
                                                    By</InputLabel>
                                                <Select inputProps={{id: `${alias.id}-${filter.by}-${filter.value}`}}
                                                        onChange={this.editFilterFieldForAlias(alias.id, filter.id, "by")}
                                                        value={filter.by}>
                                                    {settings.fields
                                                        .map(field => <MenuItem
                                                            key={toTitleCase(field.label)}
                                                            value={toTitleCase(field.label)}>{field.label}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                margin={"dense"}
                                                label={"Filter Text"}
                                                onChange={this.editFilterFieldForAlias(alias.id, filter.id, "value")}
                                                value={filter.value}/>
                                        </Grid>
                                    </Grid>
                                </div>)}
                            <Button fullWidth onClick={() => this.addFilterToAlias(alias.id)}>New Filter</Button>
                            <Typography>"{alias.name}" &lt;{alias.alias}@lynbrookrobotics.com&gt;</Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )}

                <Button
                    onClick={() => firebase.firestore().collection('aliases').add({
                        alias: Date.now(),
                        name: "New Alias",
                        filters: [],
                        private: true
                    })}>New Alias</Button>

                <Button
                    onClick={() => {
                        this.state.aliases.forEach(alias => {
                            if (alias.edited) {
                                firebase.firestore().doc(`aliases/${alias.id}`)
                                    .set(alias)
                                    .then(() => alert("Updated mail system"))
                                    .catch(e => {
                                        console.error(e);
                                    });
                            }
                        });
                    }}>Update Mail System</Button>
            </div>
        );
    }
}

export default Aliases;