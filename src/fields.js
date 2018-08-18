export default [{
    label: "Name",
    model: "name"
}, {
    label: "Email",
    model: "email"
}, {
    label: "Cell Phone Number",
    model: "cell",
    type: "phone"
}, {
    label: "Home Phone Number",
    model: "home",
    type: "phone"
}, {
    label: "Preferred Phone Number",
    model: "phone",
    options: ["Home Phone", "Cell Phone"],
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
    label: "Division(s)",
    model: "division",
    multiple: true,
    options: ["Animation", "Design", "Electrical", "Hardware", "Software"],
    type: 'select'
}, {
    label: "Role",
    model: "role",
    options: ["Adult", "Mentor", "Other", "Student"],
    type: 'select'
}];
