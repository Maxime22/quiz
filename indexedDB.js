let database;
window.onload = function () {
    let request = window.indexedDB.open("QuizBDD");

    request.onerror = function (event) {
        console.log("Erreur d'ouverture de la base de données", event);
    };

    request.onsuccess = function (event) {
        database = event.target.result;
        displayBadges();
    };

    request.onupgradeneeded = function (event) {
        database = event.target.result;
        console.log("coucou")
        let badgeStore = database.createObjectStore("badges", {keyPath: "badgeName"});
        badgeStore.createIndex("badgeName", "badgeName", { unique: true });
    };

}
function registerBadge(badgeName) {
    let transaction = database.transaction(["badges"], "readwrite");
    let badgeStore = transaction.objectStore("badges");
    let getBadges = badgeStore.get(badgeName);

    getBadges.onsuccess = function (e) {
        let data = e.target.result;

        if (data) {
            data.numberOfThisBadge++;
            badgeStore.put(data);
        } else {
            badgeStore.add({badgeName: badgeName, numberOfThisBadge: 1});
        }
        displayBadges();
    };

    getBadges.onerror = function () {
        console.error("Erreur lors de l'enregistrement du badge");
    };
}

function displayBadges() {
    let transaction = database.transaction(["badges"], "readonly");
    let badgeStore = transaction.objectStore("badges");
    let getAllBadges = badgeStore.getAll();

    getAllBadges.onsuccess = function (e) {
        let badges = e.target.result;
        let badgeListElement = document.getElementById('badgeListItems');
        badgeListElement.innerHTML = '';

        badges.forEach(badge => {
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

            // Assemblage du badge
            badgeContainer.appendChild(badgeName);
            badgeContainer.appendChild(badgeCount);
            listItem.appendChild(badgeContainer);
            badgeListElement.appendChild(listItem);
        });
    };

    getAllBadges.onerror = function () {
        console.error("Erreur lors de la récupération des badges");
    };
}