(() => {
    firebase.initializeApp({
        apiKey: "AIzaSyAD7fMnFLhF_sxY6ZKl8KMrg2tnQGdI0dI",
        authDomain: "funky-monkey-6f6f5.firebaseapp.com",
        databaseURL: "https://funky-monkey-6f6f5.firebaseio.com",
        projectId: "funky-monkey-6f6f5",
        storageBucket: "funky-monkey-6f6f5.appspot.com",
        messagingSenderId: "183313415467"
    });

    firebase.firestore().settings({
        timestampsInSnapshots: true
    });

    firebase.auth().useDeviceLanguage();
})(); // Firebase settings

(() => {
    const $dashboard = $('#dashboard');
    let originalDashboardHTML = null;

    function onUserSignedIn(user) {
        originalDashboardHTML = $dashboard.html();
        $dashboard.html('<div class="progress"><div class="indeterminate"></div></div>');
        $('.sign-in').unbind('click').bind('click', () => {
            firebase.auth().signOut();
        }).find('a').text('Sign Out');
    }

    function onUserSignedOut() {
        $dashboard.html(originalDashboardHTML);
        $('.sign-in').unbind('click').bind('click', () => {
            signIn();
        }).find('a').text('Sign In');
    }

    function signIn() {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/user.addresses.read');
        provider.addScope('https://www.googleapis.com/auth/user.birthday.read');
        provider.addScope('https://www.googleapis.com/auth/user.emails.read');
        provider.addScope('https://www.googleapis.com/auth/user.phonenumbers.read');
        provider.addScope('https://www.googleapis.com/auth/userinfo.email');
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        firebase.auth().signInWithPopup(provider);
    }

    firebase.auth().onAuthStateChanged(user => {
        switch (user) {
            case null:
            case undefined:
                onUserSignedOut();
                break;
            default:
                onUserSignedIn(user);
                break;
        }
    });

    $('.sign-in').click(signIn);
})();

(() => {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
})();
