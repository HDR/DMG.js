const {client} = require("../constants");
module.exports = {
    name: 'echo',
    aliases: ['echo'],
    description: '[Admin] Echo a message as the bot',
    options: [
        {
            "name": "channel",
            "description": "Target channel",
            "type": 7,
            "required": true
        },
        {
            "name": "message",
            "description": "Message Content",
            "type": 3,
            "required": true
        }
    ],
    choices: [],
    execute: function (channel, args, member, interaction) {
        if(member.hasPermission("MANAGE_GUILD")) {
            let channelid = args[0].value.replace(/[#<>]/g, '')
            let chnl = channel.client.channels.cache.get(channelid)
            chnl.send(args[1].value)
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: `Echoed message to ${chnl.name}`}}})
        }
    }
}