const { Permissions } = require("discord.js")

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
    choices: [],
    execute: function (channel, args, member, interaction) {
        if(member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            let channelid = args[0].value.replace(/[#<>]/g, '')
            let chnl = channel.client.channels.cache.get(channelid)
            chnl.setRateLimitPerUser(args[1].value, "Slow mode set by bot").then()
            interaction.reply(`Set ${chnl.name} slow mode to ${args[1].value} seconds`, { ephemeral: true });
        }
    }
}