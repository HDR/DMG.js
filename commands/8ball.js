const Discord = require("discord.js");
const constants = require('../constants')

module.exports = {
    name: '8ball',
    aliases: ['8ball'],
    description: 'Ask the magic 8-Ball',
    options: [],
    choices: [],
    execute: function (channel, args, member, interaction) {
        let answers = ["As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don’t count on it.", "It is certain.", "It is decidedly so.", "Most likely.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Outlook good.", "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.", "Without a doubt.", "Yes.", " Yes – definitely.", "You may rely on it."]
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#0033a0');
        Embed.setTitle("Magic 8-Ball");
        let random = answers[Math.floor(Math.random() * answers.length)];
        Embed.setDescription(random)
        Embed.setThumbnail("https://gameboy.github.io/assets/images/site/logo.png")
        Embed.setURL("https://gameboy.github.io/")
        constants.client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {embeds: [Embed]}}})
    }
}