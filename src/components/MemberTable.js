import PropTypes from 'prop-types';
import React, {Component} from "react";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import settings from "../settings";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel/TableSortLabel";
import {toTitleCase} from "../helpers";
import withStyles from "@material-ui/core/styles/withStyles";
import TableBody from "@material-ui/core/TableBody/TableBody";

class MemberTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortBy: "firstName",
            sortDir: "desc"
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

        return (
            <Table>
                <TableHead className={classes.tHead}>
                    <TableRow>
                        {
                            settings.fields.map(field => {
                                return <TableCell key={field.label}>
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
                        this.props.users
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
                                        <TableCell key={field.label}>{user[toTitleCase(field.label)]}</TableCell>)
                                }
                            </TableRow>)
                    }
                </TableBody>
            </Table>
        );
    }
}

MemberTable.propTypes = {
    classes: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired
};

MemberTable.styles = theme => ({
    tHead: {
        backgroundColor: theme.palette.background.default,
        boxShadow: "0px 3px 5px grey",
        position: 'sticky',
        top: 64
    }
});

export default withStyles(MemberTable.styles)(MemberTable);