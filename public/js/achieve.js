let openGameId = null;

// ---------------- LOAD GAMES ---------------- //
async function loadAllGames() {
    const gamesRes = await fetch('/games');

    const games = await gamesRes.json();

    const container = document.getElementById('games-container');
    container.innerHTML = "";


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

            openGameId = game.id;
            loadAchievements(game.id);
        });

        container.appendChild(gameDiv);
    });
}



async function loadGameOptions(){
    try {
        const gameRes = await fetch('/games')

        const games = await gameRes.json();

        const select = document.getElementById("gameSelect");

        select.innerHTML = `<option value="">Choose game:</option>`;

        games.forEach(i => {
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

async function submitAchievements() {
    const gameId = document.getElementById("gameSelect").value;
    const name = document.getElementById("chooseAchievemnt").value;
    const description = document.getElementById("description").value;
    const image2 = document.getElementById("imageUrl").value;

    if (!gameId || !name) {
        alert("Please fill in required fields");
        return;
    }


    await fetch("/newAchievement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            gameId,
            name,
            description,
            image2
        })
    });

    alert("Achievement submitted");
}




loadAllGames();
