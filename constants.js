const Discord = require('discord.js')

module.exports = Object.freeze({
    client: new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
});