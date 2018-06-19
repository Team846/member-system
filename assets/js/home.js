(() => {
    document.getElementById('call-to-action').addEventListener('click', () => {
        firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    });
})(); // Wow, a closure!