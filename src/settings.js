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
        MEMBERS_TABLE: {
            label: "Members",
            path: "/members",
            resolve: () => import(/* webpackChunkName: "Members" */ "./routes/private/MembersTable").then(getDefaultExport)
        },
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

    if (userProfileField.type === "multi-input-field" || userProfileField.type === "group") {
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
        condition: () => true,
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

const isStudent = profile => profile.Role === "Student";

// noinspection JSUnusedGlobalSymbols
export const userProfileFields = [{
    label: "Name"
}, {
    label: "Email"
}, {
    label: "Gender",
    options: ["Male", "Female", "Other"],
    type: "select"
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
}, {
    content: [{
        InputProps: PhoneNumberInput.props,
        label: "Number"
    }, {
        label: "Type",
        options: ["Cell", "Home"],
        type: "select"
    }],
    label: "Backup Phone",
    type: "multi-input-field"
}, {
    content: [{
        label: "Line 1"
    }, {
        label: "Line 2"
    }, {
        label: "Zip Code"
    }],
    label: "Home Address",
    type: "multi-input-field"
}, {
    label: "Teams",
    multiple: true,
    options: ["Animation", "Design", "Electrical", "Hardware", "Software"],
    type: "select"
}, {
    label: "Role",
    options: ["Mentor", "Student", "Other"],
    type: "select"
}, {
    condition: isStudent,
    label: "Student ID"
}, {
    condition: isStudent,
    label: "Graduation Year"
}, {
    condition: isStudent,
    content: [{
        label: "Name"
    }, {
        label: "Email"
    }, {
        label: "Employer"
    }],
    label: "Parent 1",
    type: "group"
}, {
    condition: isStudent,
    content: [{
        label: "Name"
    }, {
        label: "Email"
    }, {
        label: "Employer"
    }],
    label: "Parent 2",
    type: "group"
}].map(completeUserProfileField());
