const { EmbedBuilder, SlashCommandBuilder} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8-ball'),

    execute: async function (interaction) {
        let answers = ["As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don’t count on it.", "It is certain.", "It is decidedly so.", "Most likely.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Outlook good.", "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.", "Without a doubt.", "Yes.", " Yes – definitely.", "You may rely on it."]
        const Embed = new EmbedBuilder();
        Embed.setColor('#0033a0')
            .setTitle("Magic 8-Ball")
            .setDescription(answers[Math.floor(Math.random() * answers.length)])
            .setThumbnail("https://gameboy.github.io/assets/images/site/logo.png")
            .setURL("https://gameboy.github.io/")
        interaction.reply({ embeds: [Embed]});
    },
}