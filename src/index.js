import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker, {isLocalhost} from './registerServiceWorker';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// noinspection SpellCheckingInspection
const configurations = {
    development: {
        apiKey: "AIzaSyBcy4SX9wJMpF6ZNrUsd5kpJalbMcq19S4",
        authDomain: "funky-monkeys-dev.firebaseapp.com",
        databaseURL: "https://funky-monkeys-dev.firebaseio.com",
        projectId: "funky-monkeys-dev",
        storageBucket: "funky-monkeys-dev.appspot.com",
        messagingSenderId: "1042082599999"
    },
    production: {
        apiKey: "AIzaSyB1Ky0rDdrXzjD9Xl2huO9AbsixHQzSgNI",
        authDomain: "funky-member-system.firebaseapp.com",
        databaseURL: "https://funky-member-system.firebaseio.com",
        projectId: "funky-member-system",
        storageBucket: "funky-member-system.appspot.com",
        messagingSenderId: "1005314456770"
    }
};

firebase.initializeApp(configurations[isLocalhost ? 'development' : 'production']);
// firebase.initializeApp(configurations['development']);

firebase.firestore().settings({
    timestampsInSnapshots: true,
});

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
