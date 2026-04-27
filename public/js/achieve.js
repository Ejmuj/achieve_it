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



async function loadGameOptions() {
    try {
        const gameRes = await fetch('/games');
        const games = await gameRes.json();

        const selects = document.querySelectorAll(".gameSelect");

        selects.forEach(select => {
            select.innerHTML = `<option value="">Choose game:</option>`;

            games.forEach(i => {
                const option = document.createElement("option");
                option.value = i.id;
                option.textContent = i.name;
                select.appendChild(option);
            });
        });

    } catch (err) {
        console.error("loadGameOptions error:", err);
    }
}

async function loadAchiOptions() {
    try {
        const res = await fetch('/achi');
        const achievements = await res.json();

        const select = document.getElementById('achiSelect');

        select.innerHTML = `<option value="">Choose achievement:</option>`;

        achievements.forEach(a => {
            const option = document.createElement("option");
            option.value = a.id;
            option.textContent = a.name;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("loadAchiOptions error:", err);
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
    const gameId = document.getElementById("selectId").value;
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

//--------------------- Delete ---------------------------//

async function DeleteGame() {
    const game = document.getElementById('gameSelect').value;

   

        await fetch("/deleteG", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: game })
        });


        alert('deleted game')
}

async function DeleteAchievement() {
    const achi = document.getElementById('achiSelect').value;

    console.log('Selected:', achi);

    await fetch("/deleteA", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: achi })
        });
    
        alert('deleted achievement')
}

loadAllGames();
loadAchiOptions()