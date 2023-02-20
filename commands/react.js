const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')

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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    execute: function (interaction) {
        let url = interaction.options.getString('url').split('/')
        let channel = interaction.guild.channels.cache.get(url[5])
        channel.messages.fetch(url[6]).then(msg => {
            msg.react(interaction.options.getString('contents')).then()
            interaction.reply({content: `Reacted to message in ${channel}`, ephemeral: true});
        })
    }
}