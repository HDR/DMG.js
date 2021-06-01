const { Client, Intents } = require('discord.js')

module.exports = Object.freeze({
    client: new Client({ intents: [Intents.ALL], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
});