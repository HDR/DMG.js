const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lmgt')
        .setDescription('Let me google that for you generator')
        .addStringOption(option =>
        option.setName('search')
            .setDescription('What do you want to google?')
            .setRequired(true)),

    execute: function (interaction) {
        interaction.reply(`https://letmegooglethat.com/?q=${interaction.options.get('search').value.split(' ').join('+')}`);
    }
}