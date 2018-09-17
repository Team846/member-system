export default [{
    label: "Name",
    model: "name"
}, {
    label: "Email",
    model: "email"
}, {
    label: "Primary Phone Number",
    model: "phone1",
    type: "phone"
}, {
    label: "Primary Phone Number Type",
    model: "phone1type",
    options: ["Cell Phone", "Cell Phone (No SMS)", "Home Phone"],
    type: "select"
}, {
    label: "Secondary Phone Number",
    model: "home",
    type: "phone"
}, {
    label: "Secondary Phone Number Type",
    model: "phone",
    options: ["Cell Phone", "Cell Phone (No SMS)", "Home Phone"],
    type: "select"
}, {
    label: "Address",
    model: "address"
}, {
    label: "Gender",
    model: "gender",
    options: ["Male", "Female", "Other"],
    type: "select"
}, {
    label: "Role",
    model: "role",
    options: ["Adult", "Mentor", "Other", "Student"],
    type: 'select'
}];
