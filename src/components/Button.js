import * as PropTypes from "prop-types";
import {Button as MuiButton} from "@material-ui/core";
import React from "react";

/**
 * Our button styling
 * @param props
 * @returns {React.FC}
 * @constructor
 */
function Button(props) {
    const {noMarginTop, ...other} = props;

    return (
        <MuiButton
            fullWidth
            color="primary"
            style={{
                marginTop: noMarginTop ? 8 : 24
            }}
            variant="contained"
            {...other}/>
    );
}

Button.defaultProps = {
    noMarginTop: false
};

Button.propTypes = {
    noMarginTop: PropTypes.bool
};

export default Button;