import React, {Component} from "react";
import {Card, CardContent, Checkbox, Grid, IconButton, Typography} from "@material-ui/core";
import {Edit, Info, Mail, Phone} from "@material-ui/icons";

class MemberCard extends Component {
    render() {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card>
                    <CardContent>
                        <Typography variant={"headline"}>{this.props.user.name} ({this.props.user.role})</Typography>
                        <Checkbox
                            checked={this.props.selected}
                            onChange={this.props.onChange}/>
                        <a href={`mailto:${this.props.user.email}`}>
                            <IconButton>
                                <Mail/>
                            </IconButton>
                        </a>
                        <a href={`tel:${this.props.user[this.props.user.phone === 'Cell Phone' ? 'cell' : 'home']}`}>
                            <IconButton>
                                <Phone/>
                            </IconButton>
                        </a>
                        <IconButton onClick={this.props.onInfoClicked}>
                            <Info/>
                        </IconButton>
                        {
                            this.props.allowEdit &&
                            <IconButton onClick={this.props.onEditClicked}>
                                <Edit/>
                            </IconButton>
                        }
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}

export default MemberCard;
