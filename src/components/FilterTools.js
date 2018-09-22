import {Component} from "react";
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import settings from "../settings";
import PropTypes from "prop-types";
import React from "react";

class FilterTools extends Component {
    render() {
        return <Grid container spacing={16}>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    onChange={this.props.onChange}
                    label={"Filter"}
                    value={this.props.value}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                    <InputLabel htmlFor={"filter-by"}>Filter By</InputLabel>
                    <Select
                        inputProps={{id: "filter-by"}}
                        value={this.props.value1}
                        onChange={this.props.onChange1}>
                        <MenuItem value={"any"}>Any</MenuItem>
                        {settings.liteFields.map(this.props.callbackfn)}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>;
    }
}

FilterTools.propTypes = {
    onChange: PropTypes.any,
    value: PropTypes.string,
    value1: PropTypes.string,
    onChange1: PropTypes.any,
    callbackfn: PropTypes.func
};

export default FilterTools;