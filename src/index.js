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
        apiKey: "AIzaSyA_1zO62l-Vba_eLyOFXFNn4oukLLQmijM",
        authDomain: "staged-member-system.firebaseapp.com",
        databaseURL: "https://staged-member-system.firebaseio.com",
        projectId: "staged-member-system",
        storageBucket: "staged-member-system.appspot.com",
        messagingSenderId: "517864814039"
    }
};

firebase.initializeApp(configurations[isLocalhost ? 'development' : 'production']);

firebase.firestore().settings({
    timestampsInSnapshots: true
});

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
