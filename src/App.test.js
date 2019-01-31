import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import firebase from "firebase/app";

firebase.initializeApp({
    apiKey: "AIzaSyC5DIBtTgvBFH7RTu3d4LFUtsvtQ9OXyqQ",
    authDomain: "member-system-38390.firebaseapp.com",
    databaseURL: "https://member-system-38390.firebaseio.com",
    projectId: "member-system-38390",
    storageBucket: "member-system-38390.appspot.com",
    messagingSenderId: "299255312336"
});

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BrowserRouter>
        <App/>
    </BrowserRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
});
