/**
 * Moves all <div.page> elements to the appropriate position
 * @param pageNumber The page number of the target page, 0 being the home page's number
 */
function switchToPage(pageNumber) {
    const pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.left = `${(i - pageNumber) * 100}vw`;
    }
}

function resetInterface() {
    const dashboard = document.getElementById('dashboard');
    dashboard.classList.add('collapsed');
    dashboard.innerHTML = "<h4>Please wait while your dashboard loads...</h4>";
}

function onSignIn(user) {
    const dashboard = document.getElementById('dashboard');
    dashboard.classList.remove('collapsed');

    firebase.firestore().doc(`members/${user.uid}`).onSnapshot(snapshot => {
        const data = snapshot.data() || {

        };
        const name = document.createElement('h4');
        name.textContent = user.displayName;
    });
}

/*
 * If the user signed out, take them to the home page
 * Otherwise, take them to the dashboard
 */
firebase.auth().onAuthStateChanged(user => {
    switch (user) {
        case null:
        case undefined:
            switchToPage(0);
            resetInterface();
            break;
        default:
            switchToPage(1);
            onSignIn(user);
            break
    }
});
