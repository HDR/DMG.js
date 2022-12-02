const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')
const {client} = require("../constants");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('react')
        .setDescription('React to a message as the bot')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Link to target message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contents')
                .setDescription('Emoji')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    execute: function (interaction) {
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        let splitstr = interaction.options.get('url').value.split('/')
        let chnl = channel.client.channels.cache.get(splitstr[5])
        chnl.messages.fetch(splitstr[6]).then(msg => {
            msg.react(interaction.options.get('contents').value).then()
            interaction.reply({content: `Reacted to message in ${chnl.name}`, ephemeral: true});
        })
    }
}