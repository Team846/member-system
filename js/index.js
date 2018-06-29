/*
 * THIS FILE SHOULD NOT RUN ANY CODE!!!!
 */

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

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
            if (pageNumber !== '0') {
                document.body.style.overflowY = 'hidden';
            } else {
                document.body.style.overflowY = 'scroll';
            }
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
