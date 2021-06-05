const { Permissions } = require("discord.js")
const {client} = require("../constants");

module.exports = {
    name: 'slowmode',
    aliases: ['slowmode'],
    description: 'Set channel slow modes (admin only)',
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
        const member = client.guilds.cache.get(interaction.guildID).members.cache.get(interaction.user.id)
        const channel = client.guilds.cache.get(interaction.guildID).channels.cache.get(interaction.channelID);
        if(member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            let channelid = interaction.options.get('channel').value.replace(/[#<>]/g, '')
            let chnl = channel.client.channels.cache.get(channelid)
            chnl.setRateLimitPerUser(interaction.options.get('delay').value, "Slow mode set by bot").then()
            interaction.reply(`Set ${chnl.name} slow mode to ${interaction.options.get('delay').value} seconds`, { ephemeral: true });
        }
    }
}