/*
 * This file in itself should NOT DO ANYTHING. This can only contain functions, and variables. It must
 * not run any code when it is loaded by the browser.
 */

function create$InputField(id, label, type, value) {
    return $('<div class="input-field">')
        .append(
            $('<input>')
                .val(value)
                .attr('id', id)
                .attr('type', type))
        .append(
            $('<label>')
                .text(label))
}

function create$Select(id, label, options, selected) {
    const $select = $('<select class="yellow">')
        .attr('id', id);
    options.map(it => $('<option>').text(it)).forEach($it => {
        if ($it.text() === selected) {
            $it.attr('selected', true);
        }
        $it.appendTo($select);
    });
    return $('<div class="input-field">')
        .append($select)
        .append($('<label>').text(label));
}

function createMyProfile(profile) {
    const $accountType = create$Select('type', 'Account Type', ['Student', 'Parent', 'Mentor'], profile.type);
    const $myProfile = $('#my-profile')
        .append($accountType)
        .append(create$InputField('name', 'Name', 'text', profile.name));
    $myProfile.find('select').formSelect();
    $myProfile.find('.input-field').syncWithFireField();
    M.updateTextFields();
}

async function getUserProfile(uid) {
    if (firebase.auth().currentUser === null) {
        throw new Error("Attempted to get current user's profile without a user logged in");
    }
    return (await firebase.firestore().doc(uid || `users/${firebase.auth().currentUser.uid}`).get()).data();
}

function openSignInPopup() {
    firebase.auth()['signInWithPopup'](new firebase.auth['GoogleAuthProvider']());
}

function showExtendedNavbar(show) {
    const $navContent = $('.nav-content');
    const $fixedNav = $('.navbar-fixed');
    const paddingTop = 64;
    switch (show) {
        case null:
        case undefined:
        case true:
            $navContent.slideDown();
            $fixedNav['animate']({
                height: 112 + paddingTop
            });
            break;
        default:
            $navContent.slideUp();
            $fixedNav['animate']({
                height: 64 + paddingTop
            });
            break;
    }
}
