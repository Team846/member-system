import PropTypes from 'prop-types';
import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid/Grid";
import settings from "../settings";
import {toTitleCase} from "../helpers";
import TextField from "@material-ui/core/TextField/TextField";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

class ProfileEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {
                firstName: "",
                lastName: "",
                emailAddress: "",
                primaryPhoneNumber: "",
                primaryPhoneType: "Cell Phone",
                secondaryPhoneNumber: "",
                secondaryPhoneType: "Home Phone",
                address: "",
                gender: "Other",
                role: "Student",
                studentId: "",
                graduationYear: "",
                parent1FirstName: "",
                parent1LastName: "",
                parent1EmailAddress: "",
                parent1Employer: "",
                parent2FirstName: "",
                parent2LastName: "",
                parent2EmailAddress: "",
                parent2Employer: ""
            }
        };
    }

    render() {
        const {profile} = this.state;

        return (
            <Grid justify={"center"} container>
                {
                    settings.fields
                        .map(field => Object.assign({}, settings.defaultField, {
                            model: toTitleCase(field.label)
                        }, field))
                        .filter(field => field.condition(profile))
                        .map(field => {
                            let component = null;
                            // noinspection JSUnusedLocalSymbols
                            const {condition, model, ...filtered} = field;
                            switch (field.type) {
                                case 'select':
                                    component = (
                                        <FormControl fullWidth margin={"dense"}>
                                            <InputLabel htmlFor={field.model}>{field.label}</InputLabel>
                                            <Select
                                                inputProps={{id: field.model}}
                                                onChange={this.updateProfile(model)}
                                                value={profile[model]}>
                                                {field.options
                                                    .map(option => <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    );
                                    break;
                                default:
                                    component = (
                                        <TextField
                                            {...filtered}
                                            fullWidth
                                            margin={"dense"}
                                            onChange={this.updateProfile(model)}
                                            value={profile[model]}/>)
                            }
                            return ProfileEditor.wrapWithGrid(component, field.label);
                        })
                }
            </Grid>
        );
    }

    updateProfile = model => e => {
        this.setState({profile: {...this.state.profile, [model]: e.target.value}});
    };

    static wrapWithGrid = (component, key) => <Grid item key={key} xs={11} md={7}>{component}</Grid>;
}


ProfileEditor.propTypes = {
    classes: PropTypes.object.isRequired
};

ProfileEditor.styles = {};

export default withStyles(ProfileEditor.styles)(ProfileEditor);