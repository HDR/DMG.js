const { Permissions } = require("discord.js")
const {client} = require("../constants");

module.exports = {
    name: 'slowmode',
    description: 'Set channel slow modes (admin only)',
    defaultPermission: false,
    options: [
        {
            "name": "channel",
            "description": "Target channel",
            "type": 'CHANNEL',
            "required": true
        },
        {
            "name": "delay",
            "description": "per-user slow mode delay in seconds",
            "type": 'INTEGER',
            "required": true
        }
    ],
    execute: function (interaction) {
        const member = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id)
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        if(member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            channel.client.channels.cache.get(interaction.options.get('channel').value.replace(/[#<>]/g, '')).setRateLimitPerUser(interaction.options.get('delay').value, "Slow mode set by bot").then()
            interaction.reply(`Set ${channel.client.channels.cache.get(interaction.options.get('channel').value.replace(/[#<>]/g, '')).name} slow mode to ${interaction.options.get('delay').value} seconds`, { ephemeral: true });
        }
    }
}