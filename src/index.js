import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker, {isLocalhost} from './registerServiceWorker';
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
    },
    production: {
        apiKey: "AIzaSyAcx0K0EcVt9mycKFmMhAC0wXA5ZemPoKY",
        authDomain: "official-member-system-99805.firebaseapp.com",
        databaseURL: "https://official-member-system-99805.firebaseio.com",
        projectId: "official-member-system-99805",
        storageBucket: "official-member-system-99805.appspot.com",
        messagingSenderId: "662488231065"
    }
};

firebase.initializeApp(isLocalhost ? configurations.development : configurations.production);

firebase.firestore().settings({
    timestampsInSnapshots: true
});

firebase.firestore().enablePersistence()
    .then(() => console.info("Offline persistence enabled"))
    .catch(e => console.warn("Failed to enable offline persistence", e));

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
