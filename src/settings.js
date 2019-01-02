import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';

/* TODO: Support for nesting, notated by periods */
export const model = context => (field, onChange = "onChange", value = "value", getNewValue = e => e.target.value) => {
    return {
        [onChange]() {
            context.setState({
                [field]: getNewValue(...arguments)
            });
        },
        [value]: context.state[field]
    }
};

const getDefaultExport = module => module.default;

export const routes = {
    private: {
        DASHBOARD: {
            path: "/",
            resolve: () => import("./routes/private/Dashboard").then(getDefaultExport)
        }
    },
    public: {
        LOGIN: {
            path: "/login",
            resolve: () => import("./routes/public/Login").then(getDefaultExport)
        },
        REGISTER: {
            path: "/register",
            resolve: () => import("./routes/public/Register").then(getDefaultExport)
        },
        RESET: {
            path: "/reset",
            resolve: () => import("./routes/public/Reset").then(getDefaultExport)
        }
    }
};

export const mainListItems = (
    <div>
        <ListItem button>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Integrations" />
        </ListItem>
    </div>
);
