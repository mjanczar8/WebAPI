const gameContainer = document.getElementById("games-container");

const fetchGames = async ()=>{
    try{
        //fetch data from server
        const response = await fetch("/games");
        if(!response.ok){
            throw new Error("Failed to get games");
        }

        //Parse json
        const games = await response.json();
        console.log(games);
        //Format the data to html
        gameContainer.innerHTML = " ";

        games.forEach((games) => {
            console.log("writing game...")
            const gameDiv = document.createElement("div");
            gameDiv.className = "game";
            gameDiv.innerHTML = `
            <li>${games.gameName}</li> 
            <button onclick="Update('${games._id}')">Update</button>
            <button onclick="Delete('${games._id}')">Delete</button>
            `;

            

            gameContainer.appendChild(gameDiv);
        });
    }catch(error){
        console.error("Error: ", error);
        gameContainer.innerHTML = "<p style='color:red'>Failed to get games</p>";
    }
    
    
}

const Delete = async (id)=>{
    if(!confirm("Are you sure you want to delete this Game?")) return;

    try{
        const response = await fetch(`/games/${id}`,{
            method: "DELETE"
        })

        if(!response.ok)
        {
            throw new Error("failed to delete game")
        }

        fetchGames()
    }catch(err){
        console.error("error deleting game",err)
    }
}

const Update = async (id) => {
    window.location.href = `/edit/${id}`;
};


fetchGames();