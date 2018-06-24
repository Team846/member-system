/*
 * This is the file that DOES stuff, as in adding listeners for events.
 */
const $authToggle = $('#auth-toggle').click(() => {
    switch (firebase.auth().currentUser) {
        case null:
        case undefined:
            openSignInPopup();
            break;
        default:
            firebase.auth().signOut();
            break;
    }
});

firebase.auth().onAuthStateChanged(user => {
    switch (user) {
        case null:
        case undefined:
            $authToggle.text('Sign In');
            showExtendedNavbar(false);
            break;
        default:
            $authToggle.text('Sign Out');
            showExtendedNavbar();
            getUserProfile().then(profile => {
                createMyProfile(profile || {});
            });
            setupMembers();
            switchToPage(1);
            break;
    }
});

$('#profile-modal').modal();

$('.inlink').click(e => {
    switchToPage(e.target.parentNode.getAttribute('data-page'));
});
