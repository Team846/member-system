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
    document.getElementById('dashboard').innerHTML = "<h4>Please wait while your dashboard loads...</h4>";
    document.querySelector('#dashboard').style.top = "0";
    document.querySelector('#dashboard').style.paddingTop = "0";
    document.getElementById('header').style.height = "0";
}

function onSignIn(user) {
    document.querySelector('#dashboard').style.top = "80px";
    document.querySelector('#header').style.paddingTop = "8px";
    document.querySelector('#header').style.paddingBottom = "8px";
    document.getElementById('header').style.height = "80px";
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
