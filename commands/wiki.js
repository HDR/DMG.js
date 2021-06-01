const Discord = require("discord.js");
const {client} = require("../constants");

module.exports = {
    name: 'wiki',
    aliases: ['wiki'],
    description: 'Links to the official Game Boy Discord wiki',
    options: [],
    choices: [],
    execute: function (channel, args, member, interaction) {
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#00aaaa');
        Embed.setTitle("Game Boy Discord Wiki");
        Embed.setDescription("The official game boy discord wiki, the answer to a lot of your questions.")
        Embed.setThumbnail("https://gameboy.github.io/assets/images/site/logo.png")
        Embed.setURL("https://gameboy.github.io/")
        client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {embeds: [Embed]}}})
    }
}