
export function displayBadges(badges, lessonsMap) {
    let badgeListElement = document.getElementById('badgeListItems');

    if (badgeListElement) {
        badgeListElement.innerHTML = '';
        badges.forEach(badge => {
            createBadgeWithScoreForDisplay(badge, badgeListElement, lessonsMap);
        });
    }
}

function createBadgeWithScoreForDisplay(badge, badgeListElement, lessonsMap) {
    let listItem = document.createElement('li');
    listItem.className = 'badgeItem'; // Ajouter une classe pour le styliser en CSS

    // Structure du badge
    let badgeContainer = document.createElement('div');
    badgeContainer.className = 'badgeContainer';

    let badgeName = document.createElement('span');
    badgeName.className = 'badgeName';
    badgeName.textContent = badge.badgeName;

    let badgeCount = document.createElement('span');
    badgeCount.className = 'badgeCount';
    badgeCount.textContent = `x${badge.numberOfThisBadge}`;

    let lessonScore = lessonsMap.get(parseInt(badge.badgeName.match(/\d+/)[0]));
    if (!lessonScore){
        lessonScore = "??";
    }
    let starElement = createStarElement(lessonScore);

    let lessonScoreDisplayed = document.createElement('span');
    lessonScoreDisplayed.className = "lessonScoreDisplayed";
    lessonScoreDisplayed.textContent = " (" + lessonScore + "%)";

    badgeContainer.appendChild(badgeName);
    badgeContainer.appendChild(badgeCount);
    badgeContainer.appendChild(starElement);
    badgeContainer.appendChild(lessonScoreDisplayed)

    listItem.appendChild(badgeContainer);
    badgeListElement.appendChild(listItem);
}

function createStarElement(score) {
    let starContainer = document.createElement('div');
    starContainer.className = 'lessonScoreStarContainer';

    let starCount = calculateStars(score);

    for (let i = 0; i < starCount; i++) {
        let star = document.createElement('span');
        star.className = 'lessonScoreStar';
        star.textContent = '⭐';
        starContainer.appendChild(star);
    }

    return starContainer;
}

function calculateStars(score) {
    if (score === 100) return 5;
    if (score >= 75) return 4;
    if (score >= 50) return 3;
    if (score >= 25) return 2;
    return 1;
}