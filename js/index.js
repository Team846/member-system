/*
 * THIS FILE SHOULD NOT RUN ANY CODE!!!!
 */

String.prototype.toTitleCase = function() {
    const str = this.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
};

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
        const $page = $('.page');
        $page.fadeOut(() => {
            $($page[pageNumber]).fadeIn(() => {
                $('#slide-out').sidenav('close');
                resolve();
            });
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

function vCardFromProfile(profile) {
    return `
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
END:VCARD`;
}

function searchMembers(string) {
    const matchedProfiles = [];
    users.then(collection => {
        collection.forEach(doc => {
            const profile = doc.data();
            const excluded = ['photo-url', 'uid'];
            if (Object.keys(profile)
                .filter(it => excluded.indexOf(it) === -1)
                .map(key => profile[key])
                .some(value => value.includes(string))) {
                matchedProfiles.push(profile);
            }
        });
    });
    return matchedProfiles;
}

function createUserEntryFrom(profile) {
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
                    download(`${profile.uid}.vcf`, vCardFromProfile(profile));
                }))
            .modal('open');
    });
    return row;
}
