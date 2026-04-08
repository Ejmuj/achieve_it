let openGameId = null;

// ---------------- LOAD GAMES ----------------
async function loadGames() {
    try {
        const response = await fetch('/games');
        const games = await response.json();

        const container = document.getElementById('games-container');

        games.forEach(game => {
            const gameDiv = document.createElement('div');
            gameDiv.className = "game-card";

            gameDiv.innerHTML = `
                <h2>${game.name}</h2>
                <img src="${game.picture}" alt="${game.name}">
            `;

            gameDiv.addEventListener("click", () => {

                const achievementsContainer = document.getElementById("achievements-container");

                // toggle close
                if (openGameId === game.id) {
                    achievementsContainer.innerHTML = "";
                    openGameId = null;
                    return;
                }

                // open new
                openGameId = game.id;
                loadAchievements(game.id);
            });

            container.appendChild(gameDiv);
        });

    } catch (error) {
        console.error('Error loading games:', error);
    }
}

// ---------------- LOAD ACHIEVEMENTS ----------------
async function loadAchievements(gameId) {
    const res = await fetch(`/achievements/${gameId}`);
    const achievements = await res.json();

    const container = document.getElementById("achievements-container");
    container.innerHTML = "";

    achievements.forEach(a => {
        const div = document.createElement("div");
        div.className = "achievement-card";

        div.innerHTML = `
            <h3>${a.name}</h3>
            <p>${a.description}</p>
            <img src="${a.image}" alt="${a.name}">
        `;

        container.appendChild(div);
    });
}

// start app
loadGames();
