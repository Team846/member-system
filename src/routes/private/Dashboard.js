import * as PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';

class Dashboard extends React.Component {
    render() {
        const {classes} = this.props;
        return null;
    }

    state = {
        open: true,
    };

    static styles = theme => ({});
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(Dashboard.styles)(Dashboard);