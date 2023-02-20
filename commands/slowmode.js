const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set channel slow mode timer')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Target Channel')
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName('delay')
            .setDescription('Slow Mode delay in seconds')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),

    execute: function (interaction) {
        interaction.options.getChannel('channel').setRateLimitPerUser(interaction.options.getInteger('delay')).then(
            interaction.reply({content: `Set the timeout delay to ${interaction.options.getInteger('delay')} seconds in ${interaction.options.getChannel('channel')}`, ephemeral: true})
        )
    }
}