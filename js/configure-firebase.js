/*
 * If the code is running in localhost, use the development app,
 * otherwise, switch to the production app.
 *
 * TODO: Procure a configuration for the production application
 */

const configurations = {
    development: {
        apiKey: "AIzaSyBcy4SX9wJMpF6ZNrUsd5kpJalbMcq19S4",
        authDomain: "funky-monkeys-dev.firebaseapp.com",
        databaseURL: "https://funky-monkeys-dev.firebaseio.com",
        projectId: "funky-monkeys-dev",
        storageBucket: "",
        messagingSenderId: "1042082599999"
    },
    production: {
        apiKey: "AIzaSyBcy4SX9wJMpF6ZNrUsd5kpJalbMcq19S4",
        authDomain: "funky-monkeys-dev.firebaseapp.com",
        databaseURL: "https://funky-monkeys-dev.firebaseio.com",
        projectId: "funky-monkeys-dev",
        storageBucket: "",
        messagingSenderId: "1042082599999"
    }
};

switch (location.hostname) {
    case 'localhost':
        firebase.initializeApp(configurations.development);
        break;
    default:
        firebase.initializeApp(configurations.production);
        break;
}

firebase.firestore().settings({
    timestampsInSnapshots: true
}); // Prevent the warnings from Firestore - we have no need for timestamps in our snapshots
