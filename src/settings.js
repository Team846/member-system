import React, {Component} from "react";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import MaskedInput from 'react-input-mask';

class PhoneInput extends Component {
    render() {
        return (
            <MaskedInput
                {...this.props}
                alwaysShowMask
                mask={"(999) 999-9999"}
                maskChar={"#"}/>
        );
    }
}

let phoneInputProps = {
    inputComponent: PhoneInput,
    startAdornment: <InputAdornment position={"start"}>+1</InputAdornment>
};

const isMentor = profile => profile.role === "Mentor", isStudent = profile => profile.role === "Student";

const settings = {
    defaultField: {
        condition: () => true,
        label: "Something went wrong...",
        type: "text"
    },
    defaultProfile: {
        firstName: "",
        lastName: "",
        emailAddress: "",
        primaryPhoneNumber: "",
        primaryPhoneType: "Cell Phone",
        secondaryPhoneNumber: "",
        secondaryPhoneType: "Home Phone",
        address: "",
        gender: "Other",
        role: "Student",
        studentId: "",
        graduationYear: String(new Date().getFullYear() + 4),
        parent1FirstName: "",
        parent1LastName: "",
        parent1EmailAddress: "",
        parent1Employer: "",
        parent2FirstName: "",
        parent2LastName: "",
        parent2EmailAddress: "",
        parent2Employer: "",
        permissionLevel: "Prospective",
        teams: []
    },
    fields: [
        {
            label: "First Name"
        },
        {
            label: "Last Name"
        },
        {
            label: "Email Address",
            type: "email"
        },
        {
            InputProps: phoneInputProps,
            label: "Primary Phone Number"
        },
        {
            label: "Primary Phone Type",
            options: ["Cell Phone", "Home Phone", "Cell Phone (No SMS)"],
            type: "select"
        },
        {
            InputProps: phoneInputProps,
            label: "Secondary Phone Number"
        },
        {
            label: "Secondary Phone Type",
            options: ["Cell Phone", "Home Phone", "Cell Phone (No SMS)"],
            type: "select"
        },
        {
            label: "Address"
        },
        {
            label: "Gender",
            options: ["Male", "Female", "Other"],
            type: "select"
        },
        {
            label: "Teams",
            multiple: true,
            options: ["Hardware", "Software", "Electrical", "Animation", "Design"],
            type: "select"
        },
        {
            label: "Role",
            options: ["Mentor", "Student"],
            type: "select"
        },
        {
            condition: isStudent,
            label: "Student ID"
        },
        {
            condition: isStudent,
            label: "Graduation Year",
            options: [...Array(5)].map((_, i) => String(new Date().getFullYear() + i)),
            type: "select"
        },
        {
            condition: isStudent,
            label: "Parent 1 First Name"
        },
        {
            condition: isStudent,
            label: "Parent 1 Last Name"
        },
        {
            condition: isStudent,
            label: "Parent 1 Email Address",
            type: "email"
        },
        {
            condition: isStudent,
            label: "Parent 1 Employer"
        },
        {
            condition: isStudent,
            label: "Parent 2 First Name"
        },
        {
            condition: isStudent,
            label: "Parent 2 Last Name"
        },
        {
            condition: isStudent,
            label: "Parent 2 Email Address",
            type: "email"
        },
        {
            condition: isStudent,
            label: "Parent 2 Employer"
        },
        {
            condition: isMentor,
            label: "Employer"
        }
    ],
    liteFields: ['firstName', 'lastName', 'emailAddress', 'primaryPhoneNumber', 'primaryPhoneType'],
    permissionLevels: ['Prospective', 'Tentative', 'Member', 'Officer', 'Mentor', 'Administrator'],
    tabs: [
        {
            async get() {
                const ProfileEditor = (await import('./components/ProfileEditor')).default;
                return <ProfileEditor/>;
            },
            label: "Profile Editor",
            minPermissionLevel: "Standard"
        },
        {
            async get() {
                const MemberCards = (await import('./views/MemberCards')).default;
                return <MemberCards/>
            },
            label: "Member Cards",
            minPermissionLevel: "Member"
        },
        {
            async get() {
                const MemberTable = (await import('./views/MemberTable')).default;
                return <MemberTable/>
            },
            label: "Member Table",
            minPermissionLevel: "Officer"
        },
        {
            async get() {
                const Aliases = (await import('./views/Aliases')).default;
                return <Aliases/>
            },
            label: "Aliases",
            minPermissionLevel: "Officer"
        }
    ]
};

settings.officerFields = [{
    label: "Permission Level",
    options: settings.permissionLevels,
    type: "select"
}];

export default settings;
