import * as PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

function Authentication(props) {
    const {children, classes, onSubmit, title} = props;

    return (
        <main className={classes.main}>
            <Paper className={classes.paper} elevation={2}>
                <Avatar className={classes.avatar}>
                    <LockIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">{title}</Typography>
                <form className={classes.form} onSubmit={onSubmit}>
                    {children}
                </form>
            </Paper>
        </main>
    );
}

Authentication.defaultProps = {
    onSubmit: () => null
};

Authentication.propTypes = {
    children: PropTypes.any.isRequired,
    classes: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    title: PropTypes.string.isRequired
};

Authentication.styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
});

export default withStyles(Authentication.styles)(Authentication);