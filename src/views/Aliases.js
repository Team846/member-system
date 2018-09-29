import React, {Component} from 'react';
import firebase from 'firebase/app';
import Button from "@material-ui/core/Button/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import TextField from "@material-ui/core/TextField/TextField";

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

    onNewForwardsForAlias = alias => e => {
        const aliases = this.state.aliases.slice(0);
        const localAlias = aliases.find(it => it.id === alias.id);
        localAlias.forwards = e.target.value;
        localAlias.edited = true;
        this.setState({aliases});
    };

    render() {
        return (
            <div style={{margin: 16}}>
                <Typography>Filter rules EXPAND the users selected, so a "Permission Level, Member", and a "Permission
                    Level, Officer" will send to both members and officers</Typography>
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
                            <textarea
                                style={{fontFamily: 'Roboto, sans-serif'}}
                                onChange={this.onNewForwardsForAlias(alias)}
                                value={alias.forwards}/>
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
                                        alert("Failed to update mail system")
                                    });
                            }
                        });
                    }}>Update Mail System</Button>
            </div>
        );
    }

    updateAliasState = aliasId => field => e => {
        const aliases = this.state.aliases.slice(0);
        aliases[aliases.findIndex(alias => alias.id === aliasId)] = {
            ...aliases.find(alias => alias.id === aliasId), [field]: e.target.value, edited: true
        };
        this.setState({aliases});
    };
}

export default Aliases;