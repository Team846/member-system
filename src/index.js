import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const configurations = {
    development: {
        apiKey: "AIzaSyAvxWYIj5qo__eI3rMwNV-UqwGi0Jdwl1s",
        authDomain: "staged-member-system-2.firebaseapp.com",
        databaseURL: "https://staged-member-system-2.firebaseio.com",
        projectId: "staged-member-system-2",
        storageBucket: "staged-member-system-2.appspot.com",
        messagingSenderId: "263064195037"
    }
};

firebase.initializeApp(configurations.development);

firebase.firestore().settings({
    timestampsInSnapshots: true
});

firebase.firestore().enablePersistence()
    .then(() => console.info("Offline persistence enabled"))
    .catch(e => console.warn("Failed to enable offline persistence", e));

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
