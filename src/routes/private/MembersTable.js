import firebase from "firebase/app";
import React, {Component, Fragment} from "react";
import {Table, TableBody, TableHead, TableRow, TableCell, withStyles} from "@material-ui/core";
import {userProfileFields} from "../../settings";
import Dashboard from "../../components/Dashboard";

class MembersTable extends Component {
    componentDidMount() {
        firebase.firestore().collection('users').get().then(snapshot => {
            let users = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }));

            for (let i = 0; i < 5; i++) {
                users = users.concat(users);
            }

            this.setState({
                users
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
                className={key === "Name" ? this.props.classes.stickyColumn : "" + this.props.classes.stickyHeader}
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
            return <TableCell className={key === "Name" ? this.props.classes.stickyColumn : ""}
                              key={field.key}>{user[field.key]}</TableCell>;
        }
    };

    generateRowFromUser = user => {

        return <TableRow key={user.uid}>
            {userProfileFields.map(this.generateCellFromUserAndField(user))}
        </TableRow>
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
        stickyHeader: {
            backgroundColor: theme.palette.background.default,
            top: 64,
            position: "sticky",
            willChange: "transform"
        }
    });
}

export default withStyles(MembersTable.styles)(MembersTable);