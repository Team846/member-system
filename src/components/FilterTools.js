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
import IconButton from "@material-ui/core/IconButton/IconButton";
import Mail from "@material-ui/icons/Mail";

class FilterTools extends Component {
    render() {
        return <Grid container spacing={16}>
            <Grid item xs={12} md={4}>
                <TextField
                    fullWidth
                    onChange={this.props.onFilterTextChange}
                    label={"Filter"}
                    value={this.props.filterText}/>
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                    <InputLabel htmlFor={"filter-by"}>Filter By</InputLabel>
                    <Select
                        inputProps={{id: "filter-by"}}
                        value={this.props.filterBy}
                        onChange={this.props.onFilterByChange}>
                        <MenuItem value={"any"}>Any</MenuItem>
                        {settings.liteFields.map(this.props.liteFieldsToMenuItem)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <IconButton onClick={this.props.onMailIconButtonClicked}>
                    <Mail/>
                </IconButton>
            </Grid>
        </Grid>;
    }
}

FilterTools.propTypes = {
    onFilterTextChange: PropTypes.func,
    filterText: PropTypes.string,
    filterBy: PropTypes.string,
    onFilterByChange: PropTypes.func,
    liteFieldsToMenuItem: PropTypes.func,
    onMailIconButtonClicked: PropTypes.func
};

export default FilterTools;