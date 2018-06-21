/*
 * This file in itself should NOT DO ANYTHING. This can only contain functions, and variables. It must
 * not run any code when it is loaded by the browser.
 */

async function getCurrentUserProfile() {
    if (firebase.auth().currentUser === null) {
        throw new Error("Attempted to get current user's profile without a user logged in");
    }
    const snapshot = await firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}`).get();
    return snapshot.data();
}

function openSignInPopup() {
    firebase.auth()['signInWithPopup'](new firebase.auth['GoogleAuthProvider']());
}

function showExtendedNavbar(show) {
    const $navContent = $('.nav-content');
    const $fixedNav = $('.navbar-fixed');
    switch (show) {
        case null:
        case undefined:
        case true:
            $navContent.slideDown();
            $fixedNav.animate({
                height: 112
            });
            break;
        default:
            $navContent.slideUp();
            $fixedNav.animate({
                height: 64
            });
            break;
    }
}
