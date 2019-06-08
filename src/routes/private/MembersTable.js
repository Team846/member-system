import firebase from "firebase/app";
import React, {Component, Fragment} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, withStyles} from "@material-ui/core";
import {userProfileFields} from "../../settings";
import Dashboard from "../../components/Dashboard";
import classNames from "classnames";
import * as PropTypes from "prop-types";
import {Link} from "react-router-dom";

class MembersTable extends Component {
    componentDidMount() {
        firebase.firestore().collection('users').get().then(snapshot => {
            this.setState({
                users: snapshot.docs.map(doc => ({
                    ...doc.data(),
                    uid: doc.id
                }))
            });
        });
    }

    generateTableHeaderCellFromUserProfileField = field => {
        const {key, type} = field;

        if (type === "multi-input-field" || type === "group") {
            return (
                <Fragment key={field.key}>
                    {field.content.map(this.generateTableHeaderCellFromUserProfileField)}
                </Fragment>
            )
        } else {
            return <TableCell
                className={classNames({
                    [this.props.classes.stickyColumn]: key === "Name",
                    [this.props.classes.stickyHeader]: true,
                    [this.props.classes.stickyColumnHeader]: key === "Name"
                })}
                key={field.key}>{field.key}</TableCell>
        }
    };

    generateCellFromUserAndField = user => field => {
        const {key, type} = field;

        if (type === "multi-input-field" || type === "group") {
            return (
                <Fragment key={field.key}>
                    {field.content.map(this.generateCellFromUserAndField(user))}
                </Fragment>
            )
        } else {
            return <TableCell className={key === "Name" ? this.props.classes.stickyColumn : ""} key={field.key}>
                {key === "Name"
                    ? <Link to={`/member/${user.uid}`}>{user[field.key]}</Link>
                    : user[field.key]}
            </TableCell>;
        }
    };

    generateRowFromUser = user => {

        return <TableRow key={user.uid}>
            {userProfileFields.map(this.generateCellFromUserAndField(user))}
        </TableRow>
    };

    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render() {
        return (
            <Dashboard title={"Members Table"}>
                <Table style={{whiteSpace: "nowrap"}}>
                    <TableHead className={this.props.classes.stickyHeader}>
                        <TableRow>
                            {userProfileFields.map(this.generateTableHeaderCellFromUserProfileField)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.users.map(this.generateRowFromUser)}
                    </TableBody>
                </Table>
            </Dashboard>
        );
    }

    state = {
        users: []
    };

    static styles = theme => ({
        stickyColumn: {
            backgroundColor: theme.palette.background.default,
            left: 0,
            position: "sticky",
            willChange: "transform",
            zIndex: 1
        },
        stickyColumnHeader: {
            zIndex: "3 !important"
        },
        stickyHeader: {
            backgroundColor: theme.palette.background.default,
            top: 64,
            position: "sticky",
            willChange: "transform",
            zIndex: 2
        }
    });
}

export default withStyles(MembersTable.styles)(MembersTable);