/*
 * This is the file that DOES stuff, as in adding listeners for events.
 */
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
                        } catch (e) {}
                    }
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

$('#profile-modal').modal(); // Setup the user profile modal

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
});
