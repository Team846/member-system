import PropTypes from 'prop-types';
import React, {Component, Fragment} from "react";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import settings from "../settings";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel/TableSortLabel";
import {copyToClipboard, getFilteredUsers, toTitleCase} from "../helpers";
import withStyles from "@material-ui/core/styles/withStyles";
import TableBody from "@material-ui/core/TableBody/TableBody";
import firebase from "firebase/app";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import FilterTools from "../components/FilterTools";

class MemberTable extends Component {
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
            sortBy: "firstName",
            sortDir: "desc",
            users: []
        }
    }

    onSortLabelClick = field => () => {
        if (this.state.sortBy === toTitleCase(field.label)) {
            this.setState({
                sortDir: this.state.sortDir === 'desc' ? 'asc' : 'desc'
            });
        } else {
            this.setState({
                sortBy: toTitleCase(field.label)
            });
        }
    };

    render() {
        const {classes} = this.props;

        const filteredUsers = getFilteredUsers.call(this);

        return (
            <Fragment>
                <div style={{padding: 32}}>
                    <FilterTools
                        onMailIconButtonClicked={() => {
                            copyToClipboard(filteredUsers
                                .filter(user => user.emailAddress && user.emailAddress.trim() !== "")
                                .map(user => (user.firstName.trim() !== "" && user.lastName.trim() !== "")
                                    ? `"${user.firstName} ${user.lastName}" <${user.emailAddress}>`
                                    : user.emailAddress)
                                .join(",\n"));
                            alert("Copied to clipboard...");
                        }}
                        onFilterTextChange={this.updateStateField("filterText")}
                        filterText={this.state.filterText}
                        filterBy={this.state.filterBy} onFilterByChange={this.updateStateField("filterBy")}
                        liteFieldsToMenuItem={liteField => <MenuItem
                            key={liteField}
                            value={liteField}>
                            {settings.fields.find(field => toTitleCase(field.label) === liteField).label}
                        </MenuItem>}/>
                </div>
                <div>
                    <Table>
                        <TableHead className={classes.tHead}>
                            <TableRow>
                                {
                                    settings.fields.map(field => {
                                        return <TableCell key={field.label} padding={"dense"}>
                                            <TableSortLabel active={this.state.sortBy === toTitleCase(field.label)}
                                                            direction={this.state.sortDir}
                                                            onClick={this.onSortLabelClick(field)}>
                                                {field.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                filteredUsers
                                    .sort((a, b) => {
                                        let output = 0;
                                        if (a[this.state.sortBy] < b[this.state.sortBy]) output = -1;
                                        else if (a[this.state.sortBy] > b[this.state.sortBy]) output = 1;
                                        else return 0;

                                        if (this.state.sortDir === 'asc') return -output; else return output;
                                    })
                                    .map(user => <TableRow key={user.uid}>
                                        {
                                            settings.fields.map(field =>
                                                <TableCell
                                                    padding={"dense"}
                                                    key={field.label}>{user[toTitleCase(field.label)]}</TableCell>)
                                        }
                                    </TableRow>)
                            }
                        </TableBody>
                    </Table>
                </div>
            </Fragment>
        );
    }

    updateStateField = field => e => {
        this.setState({[field]: e.target.value});
    }
}

MemberTable.propTypes = {
    classes: PropTypes.object.isRequired
};

MemberTable.styles = theme => ({
    tHead: {
        '& *': {
            whiteSpace: 'nowrap'
        },
        backgroundColor: theme.palette.background.default,
        boxShadow: "0px 3px 5px grey",
        position: 'sticky',
        top: 64
    }
});

export default withStyles(MemberTable.styles)(MemberTable);