import React, {Component} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";

class SelectField extends Component {
    render() {
        return (
            <FormControl fullWidth margin={"dense"}>
                <InputLabel htmlFor={this.props.model}>{this.props.label}</InputLabel>
                <Select
                    inputProps={{
                        id: this.props.model
                    }}
                    {...this.props}>
                    {this.props.options.map(option =>
                        <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </Select>
            </FormControl>
        );
    }
}

export default SelectField