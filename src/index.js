import App from './App';
import {BrowserRouter} from "react-router-dom";
import firebase from "firebase/app";
import ReactDOM from 'react-dom';
import React from 'react';
import * as serviceWorker from './serviceWorker';
import "firebase/firestore";

firebase.initializeApp({
    apiKey: "AIzaSyC5DIBtTgvBFH7RTu3d4LFUtsvtQ9OXyqQ",
    authDomain: "member-system-38390.firebaseapp.com",
    databaseURL: "https://member-system-38390.firebaseio.com",
    projectId: "member-system-38390",
    storageBucket: "member-system-38390.appspot.com",
    messagingSenderId: "299255312336"
});

const app = (
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
