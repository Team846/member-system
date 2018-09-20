import Phone from '@material-ui/icons/Phone';
import Mail from '@material-ui/icons/Mail';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Hidden from "@material-ui/core/Hidden/Hidden";

class MemberCards extends Component {
    render() {
        return (
            <Grid container spacing={32}>
                {
                    this.props.users
                        .map(user => {
                            return (
                                <Grid key={user.uid} item xs={12} md={4} lg={3}>
                                    <Card>
                                        <CardContent>
                                            <Typography
                                                variant={"headline"}>{user.firstName} {user.lastName}</Typography>
                                            <Checkbox/>
                                            <Hidden mdUp>
                                                {user.primaryPhoneNumber && user.primaryPhoneNumber !== "" && <IconButton
                                                    onClick={() => window.open(`tel:${user.primaryPhoneNumber}`)}>
                                                    <Phone/>
                                                </IconButton>}
                                                <Fragment/>
                                            </Hidden>
                                            {user.emailAddress && user.emailAddress !== "" &&
                                            <IconButton onClick={() => window.open(`mailto:${user.emailAddress}`)}>
                                                <Mail/>
                                            </IconButton>}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })
                }
            </Grid>
        );
    }
}

MemberCards.propTypes = {
    users: PropTypes.array.isRequired
};

export default MemberCards;