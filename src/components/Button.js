import * as PropTypes from "prop-types";
import {Button as MuiButton, withStyles} from "@material-ui/core";
import React from "react";

function Button(props) {
    return (
        <MuiButton
            fullWidth
            className={props.classes.root}
            color="primary"
            variant="contained"
            {...props}/>
    );
}

Button.propTypes = {
    classes: PropTypes.object.isRequired
};

Button.styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 2
    }
});

export default withStyles(Button.styles)(Button);