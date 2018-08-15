import React, {Component} from 'react';
import {Grid} from '@material-ui/core';

class InputGrid extends Component {
    render() {
        return (
            <Grid item xs={11} md={7}>
                {this.props.children}
            </Grid>
        );
    }
}

export default InputGrid;