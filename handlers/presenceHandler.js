const {client} = require("../constants");
const cron = require("node-cron");
const scraper = require('table-scraper')

client.on('ready', msg => {
    randomGame()
    cron.schedule('0 0 0 * * *', () => {
        randomGame()
    })
});


function randomGame() {
    scraper.get('https://en.wikipedia.org/wiki/List_of_best-selling_Game_Boy_video_games').then(function(tableData) {
        let random = Math.round(Math.random() * (tableData[2].length - 0));
        let game = Object.values(tableData[2][random])[0]
        // Add handling for Pokemon Gold/Silver, this is needed because the wiki used to obtain the games list groups these
        if (game === "Pokémon Gold and Silver") {
            let tmpr = Math.round(Math.random() * (2 - 1) + 1);
            switch(tmpr){
                case 1:
                    game = 'Pokémon Gold'
                    break;
                case 2:
                    game = 'Pokémon Silver'
                    break;
            }
        }
        // Add handling for Pokemon Red/Green/Blue, this is needed because the wiki used to obtain the games list groups these
        if (game === 'Pokémon Red, Green and Blue') {
            let tmpr = Math.round(Math.random() * (3 - 1) + 1);
            switch(tmpr){
                case 1:
                    game = 'Pokémon Red'
                    break;
                case 2:
                    game = 'Pokémon Green'
                    break;
                case 3:
                    game = 'Pokémon Blue'
                    break;
            }
        }
        client.user.setActivity(game).then()
    })
}