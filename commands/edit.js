const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js")
const {client} = require("../constants");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('edit')
        .setDescription('Echo a message to a channel as the bot')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Link to target message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contents')
                .setDescription('New message contents')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    execute: function (interaction) {
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        let splitstr = interaction.options.get('url').value.split('/')
        let chnl = channel.client.channels.cache.get(splitstr[5])
        chnl.messages.fetch(splitstr[6]).then(msg => {
            msg.edit(interaction.options.get('contents').value).then()
            interaction.reply({content: `Edited message in ${chnl.name}`, ephemeral: true });
        })
    }
}