const {client} = require("../constants");

module.exports = {
    name: 'slowmode',
    aliases: ['slowmode'],
    description: 'Set channel slow modes (admin only)',
    options: [
        {
            "name": "channel",
            "description": "Target channel",
            "type": 7,
            "required": true
        },
        {
            "name": "delay",
            "description": "per-user slow mode delay in seconds",
            "type": 4,
            "required": true
        }
    ],
    choices: [],
    execute: function (channel, args, member, interaction) {
        if(member.hasPermission("MANAGE_GUILD")) {
            let channelid = args[0].value.replace(/[#<>]/g, '')
            let chnl = channel.client.channels.cache.get(channelid)
            chnl.setRateLimitPerUser(args[1].value, "Slow mode set by bot").then()
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: `Set ${chnl.name} slow mode to ${args[1].value} seconds`, flags: 64}}})
        }
    }
}