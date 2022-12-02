const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js")
const {client} = require("../constants");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Echo a message to a channel as the bot')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('target channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contents')
                .setDescription('message contents')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    execute: function (interaction) {
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        let channelid = interaction.options.get('channel').value.replace(/[#<>]/g, '')
        let chnl = channel.client.channels.cache.get(channelid)
        chnl.send(interaction.options.get('contents').value)
        interaction.reply({content: `Echoed message to ${chnl.name}`, ephemeral: true });
    }
}