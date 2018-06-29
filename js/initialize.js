/*
 * This is the file that DOES stuff, as in adding listeners for events.
 */
// switchToPage(0);

firebase.auth()['onAuthStateChanged'](async (user) => {
    window.user = user;
    const $progress = $('#progress');
    switch (user) {
        case null:
        case undefined:
            $authToggle.text('Sign In');
            await showExtendedNavbar(false); // Allow the animation to complete
            $progress.fadeOut();
            break;
        default:
            $authToggle.text('Sign Out');
            window.users = firebase.firestore().collection('users').get();
            await showExtendedNavbar();
            $progress.fadeIn();
            $('#name').val(user.displayName);
            $('#uid').val(user.uid);
            $('#email').val(user.email);
            $('#photo-url').val(user.photoURL);
            window.$myProfile = $('#my-profile').submit(e => {
                e.preventDefault(); // Stop the page from reloading
                const profile = {};
                $myProfile
                    .find('select')
                    .each((i, element) =>
                        profile[element.id] = M.FormSelect.getInstance(element).input.value);
                $myProfile
                    .find('input')
                    .not('.select-dropdown') // Material selects create an input to display the current selection
                    .not('[type=submit]') // Filter out the "Update" button
                    .each((i, element) => {
                        profile[element.id] = element.value
                    });
                M.toast({html: "Updating Profile..."});
                firebase.firestore().doc(`users/${user.uid}`).set(profile)
                    .then(() => M.toast({html: "Updated successfully"}))
                    .catch(e => {
                        console.error(e);
                        M.toast({html: "Failed to updated"});
                    });
            });
            M.updateTextFields();
            window.users.then(collection => {
                $progress.fadeOut();
                collection.forEach(doc => {
                    const profile = doc.data();
                    if (profile.uid === user.uid) {
                        setupSpecificProfile(profile['account-type']);
                        try {
                            Object.keys(profile).forEach(key => {
                                const $input = $(`#${key}`);
                                const inputElement = $input[0];
                                if (inputElement instanceof HTMLSelectElement) {
                                    M.FormSelect.getInstance(inputElement).input.value = profile[key];
                                } else {
                                    $input.val(profile[key]);
                                }
                            });
                        } catch (e) {
                        }
                    }
                    let row = $('<tr>');
                    for (let i = 0; i < columns; i++) {
                        row.append($('<td>').text(profile[tableOrder[i]]).width(columnWidth));
                    }
                    row.click(() => {
                        const tBody = $('<tbody>');
                        Object.keys(profile).forEach(key => {
                            if (key === 'uid' || key === 'photo-url') return;
                            tBody.append($('<tr>')
                                .append($('<td>').text(key.replace(/-/g, ' ').toTitleCase()))
                                .append($('<td>').text(profile[key])))
                        });

                        $('#profile-modal')
                            .empty()
                            .append($(`<img class="left" src="${profile['photo-url']}">`)
                                .width(128)
                                .height(128)
                                .css('margin-right', '32px')
                                .css('border-radius', '50%'))
                            .append($('<h3>').text(profile['name']))
                            .append($('<h4>').text(profile['email']))
                            .append($('<table>').append(tBody))
                            .append($('<button class="btn darken-2 yellow waves-effect">')
                                .html('Download<i class="right material-icons">cloud_download</i>')
                                .css('margin', '16px')
                                .click(() => {
                                    download(`${profile.uid}.vcf`, `
BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
ORG:${profile['place-of-employment']}
PHOTO;VALUE=URI:${profile['photo-url']}
TEL;TYPE=WORK,VOICE:${profile['cell-phone']}
TEL;TYPE=HOME,VOICE:${profile['home-phone']}
ADR;TYPE=HOME:;;${profile.address};San Jose;CA;95129;United States of America
LABEL;TYPE=HOME:${profile.address}\nSan Jose\, CA 95129\nUnited States of America
EMAIL:${profile.email}
END:VCARD
                                    `);
                                }))
                        .modal('open');
                    });
                    $('#member-table').find('tbody').append(row);
                });
                M.updateTextFields();
            });
            break;
    }
});

window.$authToggle = $('#auth-toggle').click(() => {
    switch (firebase.auth().currentUser) {
        case null:
        case undefined:
            firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
            break;
        default:
            firebase.auth().signOut();
            break;
    }
}); // Setup login and signing out

$('#profile-modal').modal({
    onCloseEnd: () => {
        document.body.style.overflowY = 'hidden';
    }
}); // Setup the user profile modal

window.$subpageLinks = $('.subpage-link').click(async (e) => {
    const page = e.target.getAttribute('data-page');
    await switchToPage(page);
    $subpageLinks.removeClass("active").filter(`[data-page=${page}]`).addClass('active');
});

window.$graduationYear = $('#graduation-year').empty();

[...Array(5)].forEach((_, i) => {
    const year = new Date().getFullYear() + i;
    $graduationYear.append(`<option value="${year}">${year}</option>`);
});

$('select').formSelect(); // Initialize the select elements
$('#account-type').formSelect({
    dropdownOptions: {
        onCloseEnd: () => {
            setTimeout(() => {
                setupSpecificProfile(M.FormSelect.getInstance($('#account-type')[0]).input.value);
            }, 100);
        }
    }
}); // It's a special dropdown

let ticking = false;
addEventListener('scroll', () => {
    ticking = true;
    if (ticking) {
        requestAnimationFrame(() => {
            $('#member-table').find('thead')
                .css('fixed');
            ticking = false;
        });
    }
});

String.prototype.toTitleCase = function() {
    const str = this.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
};

window.columns = Math.min(Math.floor((innerWidth - 64) / 200), 9); // Oooh big boy math, columns should be over 200px
window.columnWidth = Math.floor(innerWidth - 64) / columns;
window.tableOrder = ['name', 'email', 'cell-phone', 'home-phone', 'preferred-contact', 'address'];
const row = $('<tr>');
for (let i = 0; i < columns; i++) {
    row.append($('<th>').text(tableOrder[i].replace('-', ' ').toTitleCase()).width(columnWidth));
}
$('#member-table').find('thead').append(row);

window.compact = false;
window.$compact = $('#compact-toggle').click(e => {
    if (compact) {
        showExtendedNavbar();
        $('.input-field').animate({
            marginBottom: 32,
            marginTop: 32
        });
        $('#member-page').animate({
            marginTop: -32
        });
        $compact.text('Compact');
    } else {
        showExtendedNavbar(false);
        $('.input-field').animate({
            marginBottom: 16,
            marginTop: 16
        });
        $('#member-page').animate({
            marginTop: -64
        });
        $compact.text('Cozy');
    }
    compact = !compact
});
