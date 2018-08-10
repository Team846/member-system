import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker, {isLocalhost} from './registerServiceWorker';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// noinspection SpellCheckingInspection
const configurations = {
    development: {
        apiKey: "AIzaSyA_1zO62l-Vba_eLyOFXFNn4oukLLQmijM",
        authDomain: "staged-member-system.firebaseapp.com",
        databaseURL: "https://staged-member-system.firebaseio.com",
        projectId: "staged-member-system",
        storageBucket: "staged-member-system.appspot.com",
        messagingSenderId: "517864814039"
    },
    production: {
        apiKey: "AIzaSyBaTjYf7uhPfgKO6N0TYw1M8MHTHDO5iw0",
        authDomain: "official-member-system.firebaseapp.com",
        databaseURL: "https://official-member-system.firebaseio.com",
        projectId: "official-member-system",
        storageBucket: "official-member-system.appspot.com",
        messagingSenderId: "682019464677"
    }
};

firebase.initializeApp(configurations[isLocalhost ? 'development' : 'production']);

firebase.firestore().settings({
    timestampsInSnapshots: true
});

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
