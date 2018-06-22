/*
 * This is the file that DOES stuff, as in adding listeners for events.
 */
jQuery.fn.extend({
    syncWithWindow: function() {
        return this.each((i, element) => {
            // Send the data in this element to Firestore every second
            const intervalID = setInterval(() => {
                const $selects = $(element).find('select'),
                    user = firebase.auth().currentUser,
                    doc = firebase.firestore().doc(`users/${user.uid}`);
                if (user === null || user === undefined) clearInterval(intervalID);
                const $element = $selects.length === 0 ? $(element).find('input') : $selects;
                const field = $element.attr('id');
                profile[field] = $element[0] instanceof HTMLSelectElement
                    ? M.FormSelect['getInstance']($element[0]).input.value
                    : $element.val();
            }, 500);
        });
    }
});

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
                window.profile = profile;
                createMyProfile(profile || {});
            });
            break;
    }
});
