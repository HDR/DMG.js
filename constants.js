const { Client, Intents } = require('discord.js')

module.exports = Object.freeze({
    client: new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })
});