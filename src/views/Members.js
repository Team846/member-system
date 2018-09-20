import React, {Component, Fragment} from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import PropTypes from 'prop-types';
import TextField from "@material-ui/core/TextField/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import settings from "../settings";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import {toTitleCase} from "../helpers";
import MemberCards from "../components/MemberCards";
import MemberTable from "../components/MemberTable";
import firebase from 'firebase/app';

class Members extends Component {
    componentDidMount() {
        this.unsubscribe = firebase.firestore().collection('users').onSnapshot(snapshot => {
            let users = snapshot.docs.map(doc => doc.data());
            this.setState({users: users});
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    constructor(props) {
        super(props);
        this.state = {
            filterBy: "any",
            filterText: "",
            users: []
        }
    }

    render() {
        const {classes} = this.props;

        const filteredUsers = this.state.users.slice(0).filter(user => {
            if (this.state.filterBy === "any") {
                return Object.values(user).join('|;|').toLowerCase().includes(this.state.filterText.toLowerCase());
            } else {
                return (user[this.state.filterBy] || this.state.filterText).toLowerCase().includes(this.state.filterText.toLowerCase());
            }
        }).slice(0, 25);

        return (
            <Fragment>
                <div className={classes.toolsContainer}>
                    <Grid container spacing={16}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                onChange={this.updateStateField("filterText")}
                                label={"Filter"}
                                value={this.state.filterText}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor={"filter-by"}>Filter By</InputLabel>
                                <Select
                                    inputProps={{id: "filter-by"}}
                                    value={this.state.filterBy}
                                    onChange={this.updateStateField("filterBy")}>
                                    <MenuItem value={"any"}>Any</MenuItem>
                                    {settings.liteFields.map(liteField => <MenuItem
                                        key={liteField}
                                        value={liteField}>
                                        {settings.fields.find(field => toTitleCase(field.label) === liteField).label}
                                    </MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {this.props.variant === "cards" && <MemberCards users={filteredUsers}/>}
                </div>
                {this.props.variant === "table" && <MemberTable users={filteredUsers}/>}
            </Fragment>
        );
    }

    updateStateField = field => e => {
        this.setState({[field]: e.target.value});
    }
}

Members.propTypes = {
    classes: PropTypes.object.isRequired,
    variant: PropTypes.oneOf(["cards", "table"])
};

Members.styles = {
    toolsContainer: {
        padding: 32
    }
};

export default withStyles(Members.styles)(Members);