/*
 * THIS FILE SHOULD NOT RUN ANY CODE!!!!
 */

function showExtendedNavbar(shouldShowNavbar) {
    const $navContent = $('.nav-content');
    const $navContainer = $('.navbar-fixed');
    const padding = 32;

    return new Promise(function(resolve, reject) {
        switch (shouldShowNavbar) {
            case undefined:
            case null:
            case true:
                $navContent.slideDown();
                $navContainer.animate({
                    height: 110 + padding
                }, resolve);
                break;
            default:
                $navContent.slideUp();
                $navContainer.animate({
                    height: 64 + padding
                }, resolve);
        }
    });
}

function switchToPage(pageNumber) {
    return new Promise(function(resolve, reject) {
        $('.page').each((i, page) => {
            $(page).animate({
                left: `${(i - pageNumber) * 100}vw`
            }, resolve);
        });
    });
}

function setupSpecificProfile(value) {
    const $adultProfile = $('#adult-profile');
    const $student = $('#student-profile');
    switch (value) {
        case 'Student':
            $adultProfile.fadeOut(() => {
                $student.fadeIn();
            });
            break;
        case 'Adult':
            $student.fadeOut(() => {
                $adultProfile.fadeIn();
            });
            break;
    }
}
