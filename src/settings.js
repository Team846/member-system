import {InputAdornment} from "@material-ui/core";
import InputMask from "react-input-mask";
import React from "react";

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
        PROFILE_EDITOR: {
            label: "Profile Editor",
            path: "/",
            resolve: () => import(/* webpackChunkName: "ProfileEditor" */"./routes/private/ProfileEditor").then(getDefaultExport)
        }
    },
    public: {
        LOGIN: {
            label: "Login",
            path: "/login",
            resolve: () => import(/* webpackChunkName: "Login" */ "./routes/public/Login").then(getDefaultExport)
        },
        REGISTER: {
            label: "Register",
            path: "/register",
            resolve: () => import(/* webpackChunkName: "Register" */ "./routes/public/Register").then(getDefaultExport)
        },
        RESET: {
            label: "Reset",
            path: "/reset",
            resolve: () => import(/* webpackChunkName: "Reset" */ "./routes/public/Reset").then(getDefaultExport)
        }
    }
};

const completeUserProfileField = (prefix = "") => userProfileField => {
    let fullField;

    if (userProfileField.type === "multi-input-field") {
        fullField = {
            ...userProfileField,
            content: userProfileField.content.map(completeUserProfileField(`${prefix + userProfileField.label} `))
        };
    } else {
        fullField = Object.assign({
            type: "text"
        }, userProfileField);
    }

    return {
        ...fullField,
        key: prefix + fullField.label
    };
};

const PhoneNumberInput = props => <InputMask mask={"(999) 999-9999"} maskChar={"#"} alwaysShowMask {...props}/>;

// noinspection JSUnusedGlobalSymbols
PhoneNumberInput.props = {
    inputComponent: PhoneNumberInput,
    startAdornment: <InputAdornment position={"start"}>+1</InputAdornment>
};

// noinspection JSUnusedGlobalSymbols
export const userProfileFields = [{
    label: "Name"
}, {
    label: "Email"
}, {
    content: [{
        InputProps: PhoneNumberInput.props,
        label: "Number"
    }, {
        label: "Type",
        options: ["Cell", "Home"],
        type: "select"
    }],
    label: "Primary Phone",
    type: "multi-input-field"
}].map(completeUserProfileField());
