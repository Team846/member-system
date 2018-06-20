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

    function createInputField(name, type, value) {
        const id = name.replace(' ', '-').toLowerCase();
        return $('<div>')
            .addClass('input-field')
            .append(
                $('<input>')
                    .attr('id', id)
                    .addClass('validate')
                    .attr('type', type)
                    .val(value))
            .append(
                $('<label>')
                    .attr('for', id)
                    .text(name));
    }

    function onUserSignedIn(user) {
        $dashboard.html('<div class="progress"><div class="indeterminate"></div></div>');
        $('.sign-in').unbind('click').bind('click', () => {
            firebase.auth().signOut();
        }).find('a').text('Sign Out');
        firebase.firestore().doc(`users/${user.uid}`).onSnapshot(doc => {
            $dashboard.html(''); // Reset the dashboard
            const userDescription = doc.data() || {};
            $dashboard
                .append($('<form>')
                    .css('margin-top', '100px')
                    .append(createInputField("Name", "text", userDescription.name || user.displayName)
                        .prop('disabled', true))
                    .append(createInputField("Gender", "text", userDescription.gender))
                    .append(createInputField("Birthday", "date", userDescription.birthday))
                    .append(createInputField("Graduation Year", "date", userDescription.graduationYear))
                    .append(createInputField("Address", "text", userDescription.address))
                    .append(createInputField("City", "text", userDescription.city))
                    .append(createInputField("Zip Code", "text", userDescription.zipCode))
                    .append(createInputField("Parent 1", "text", userDescription.parent1))
                    .append(createInputField("Parent 2", "text", userDescription.parent2)))
                // .append($('<button class="">'));
            M.updateTextFields();
        });
    }

    function onUserSignedOut() {
        $('.sign-in').unbind('click').bind('click', () => {
            signIn();
        }).find('a').text('Sign In');
    }

    function signIn() {
        firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    function switchToPage(pageNumber) {
        $('.page').each((i, page) => {
            $(page).animate({
                left: `${(i - pageNumber) * 100}vw`
            })
        });
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
    $('.sublink').each((i, sublink) => {
        sublink.addEventListener('click', () => {
            let targetPage = parseInt(sublink.getAttribute('data-page'));
            $('.sublink').removeClass('active');
            $(`.sublink[data-page=${targetPage}]`).each((i, element) => {
                element.classList.add('active');
            }); // Ensure both the sidenav and the navbar link is updated
            switchToPage(targetPage);
        });
    });
})();

(() => {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
})();
