/*
 * This file in itself should NOT DO ANYTHING. This can only contain functions, and variables. It must
 * not run any code when it is loaded by the browser.
 */

/**
 * Create a input field styled with materializecss
 * @param id The input field's id, also it's firebase key
 * @param label The input field's label
 * @param type The input type
 * @param value The input field
 * @returns {jQuery}
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
    return $('<div class="black-text input-field">')
        .append($select)
        .append($('<label>').text(label).attr('for', id));
}

function createMyProfile(profile) {
    const currentUser = firebase.auth().currentUser;
    const myProfile = $('#my-profile')
        .empty()
        .append(create$InputField('name', 'Name', 'text', profile.name || currentUser.displayName))
        .append(create$InputField('email', 'Email', 'email', currentUser.email))
        .append(create$Select('gender', 'Gender', ['Male', 'Female', 'Other'], profile.gender))
        .append(create$Select('accountType', 'Account Type', ['Student', 'Parent', 'Mentor'], profile.accountType))
        .append(create$InputField('cellPhone', 'Cell Phone', 'text', profile.cellPhone));

    switch (profile.accountType) {
        case 'Student':
            const year = new Date().getFullYear();
            myProfile
                .append(create$InputField('birthday', 'Birthday', 'date', profile.birthday))
                .append(create$Select('graduationYear', 'Graduation Year', [...Array(5)].map((_, i) => year + i), year))
                .append(create$InputField('github', 'GitHub Username', 'text', profile.github))
                .append(create$InputField('parent1', 'Parent 1\'s Code (From their dashboard)', 'text', profile.parent1))
                .append(create$InputField('parent2', 'Parent 2\'s Code', 'text', profile.parent2));
            break;
        case 'Parent':
        case 'Mentor':
            myProfile
                .append(create$InputField('homePhone', 'Home Phone', 'text', profile.homePhone))
                .append(create$InputField('cellPhone', 'Cell Phone', 'text', profile.cellPhone))
                .append(create$InputField('address', 'Address', 'text', profile.address))
                .append(create$InputField('city', 'City', 'text', profile.city))
                .append(create$InputField('zipCode', 'Zip Code', 'text', profile.zipCode))
                .append(create$InputField('company', 'Company', 'text', profile.company))
                .append(create$Select('employment', 'Employment', ['Full time', 'Part time', 'Unemployed'], profile.employment));
    }
    if (profile.accountType === 'Parent')
        myProfile
            .append($('<button' +
                ' class="btn waves-button-input"' +
                ' onclick="`${firebase.auth().currentUser.uid}`.copyToClipboard();' +
                'M.toast({html: `Copied to clipboard`})">')
                .text('Get Parent Code'));
    myProfile
        .append($('<button class="btn waves-effect">').text('Update').click(() => {
            M.toast({html: "Updating your profile..."});
            collectAndSendProfileInfo();
        }));
    const $accountType = $('#accountType');
    $accountType['formSelect']({
        dropdownOptions: {
            onCloseEnd: function() {
                profile.accountType = M.FormSelect.getInstance($accountType[0]).input.value;
                createMyProfile(profile);
            }
        }
    });
    $('select').not('#accountType')['formSelect']();
    M.updateTextFields();
}

async function getUserProfile(uid) {
    if (firebase.auth().currentUser === null) {
        throw new Error("Attempted to get current user's profile without a user logged in");
    }
    return (await firebase.firestore().doc(uid || `users/${firebase.auth().currentUser.uid}`).get()).data();
}

function collectAndSendProfileInfo() {
    const profile = {};
    const $myProfile = $('#my-profile');
    $myProfile
        .find('select')
        .each((i, select) => {
            profile[select.id] = M.FormSelect['getInstance'](select).input.value
        });
    $myProfile
        .find('input')
        .not('.select-dropdown')
        .each((i, input) => {
            profile[input.id] = input.value;
        });
    firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}`).set(profile).then(() => {
        M.toast({html: "Your profile has been updated"});
    }).catch((e) => {
        if (e.code === 'resource-exhausted') {
            M.toast({html: 'Try again tomorrow'});
        } else {
            M.toast({html: "Failed to update"});
        }
        console.error(e);
    });
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

function switchToPage(pageNumber) {
    $('.page').each((i, page) => {
        $(page).animate({
            left: `${(i - pageNumber) * 100}vw`
        })
    })
}

String.prototype.copyToClipboard = function() {
    const textarea = $('<textarea>')
        .val(this)
        .attr('readonly', true)
        .css('position', 'absolute')
        .css('left', '-9999px')
        .appendTo($(document.body))[0];
    const selected = document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }
};

function setupMembers() {
    if (firebase.auth().currentUser === null || firebase.auth().currentUser === undefined) return;
    firebase.firestore().collection('users').get().then(collection => {
        const table = $('<table>');
        collection.forEach(doc => {
            const profile = doc.data();
            table
                .append(profile.accountType === 'Student'
                    ? buildRowFromStudentProfile(profile)
                    : buildRowFromAdultProfile(profile));
        });
        $('#members').append(table);
    });
}

function createTD(text) {
    return $('<td>').text(text || {})
}

function buildRowFromStudentProfile(profile) {
    return $('<tr>')
        .append(createTD(profile.name))
        .append(createTD(profile.email))
        .append(createTD(profile.gender))
        .append(createTD(profile.cellPhone))
}

function buildRowFromAdultProfile(profile) {

}
