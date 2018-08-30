import React, {Component} from "react"
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from "@material-ui/core"
import firebase from "firebase";
import fields from "../fields"

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

class MemberTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            orderedBy: "Name",
            orderDir: 'asc'
        }

    }

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

    changeSortDir = label => e => {
        if (this.state.orderedBy === label) {
            this.setState({
                orderDir: this.state.orderDir === 'asc' ? 'desc' : 'asc'
            });
            return
        }
        this.setState({
            orderedBy: label
        })
    };

    render() {
        if (!this.state.users) return null;

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            fields.map(column => {
                                    return <TableCell key={column.label}>
                                        <TableSortLabel
                                            active={this.state.orderedBy === column.label}
                                            direction={this.state.orderDir}
                                            onClick={this.changeSortDir(column.label)}
                                        />
                                        {column.label}
                                    </TableCell>
                                }
                            )
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        this.state.users
                            .sort(getSorting(this.state.orderDir, fields.find(col => col.label === this.state.orderedBy).model))
                            .map(user =>
                                <TableRow key={user.uid}>
                                    {fields
                                        .map(column => {
                                            return <TableCell key={column.model}>
                                                {user[column.model]}
                                            </TableCell>
                                        })}
                                </TableRow>
                            )
                    }
                </TableBody>
            </Table>
        )
    }
}

export default MemberTable