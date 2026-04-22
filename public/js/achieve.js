let openGameId = null;

// ---------------- LOAD GAMES ---------------- //
async function loadAllGames() {
    const [gamesRes, myGamesRes] = await Promise.all([
        fetch('/games'),
        fetch('/myGames')
    ]);

    const games = await gamesRes.json();
    const myGames = await myGamesRes.json();

    const container = document.getElementById('games-container');
    container.innerHTML = "";

    const allGames = [...games, ...myGames];

    allGames.forEach(game => {
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

            openGameId = game.id;
            loadAchievements(game.id);
        });

        container.appendChild(gameDiv);
    });
}



async function loadGameOptions(){
    try {
        const [gamesRes, myGamesRes] = await Promise.all([
            fetch('/games'),
            fetch('/myGames')
        ]);

        const games = await gamesRes.json();
        const myGames = await myGamesRes.json();

        const allGames = [...games, ...myGames];

        const select = document.getElementById("gameSelect");

        select.innerHTML = `<option value="">Choose game:</option>`;

        allGames.forEach(i => {
            const option = document.createElement("option");
            option.value = i.id;
            option.textContent = i.name;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("loadGameOptions error:", err);
    }
}



// ---------------- LOAD ACHIEVEMENTS ---------------- //
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

// -------------------- SUBMIT -----------------------//

async function submitGames(){
    const game = document.getElementById("chooseGame").value;
    const image = document.getElementById("image").value;

    if(!game){
        alert("fill in all fields")
        return;
    }

    await fetch("/newGame", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, image })
    });

    alert("game submitted");
}



loadAllGames();
