const constants = require('../constants')
module.exports = {
    name: 'edit',
    aliases: ['edit'],
    description: 'Edit a message posted by the bot',
    options: [
        {
            "name": "URL",
            "description": "Link to message you want to edit",
            "type": 3 ,
            "required": true
        },
        {
            "name": "Contents",
            "description": "New message contents",
            "type": 3 ,
            "required": true
        }
    ],
    choices: [],
    execute: function (channel, args, member, interaction) {
        if(member.hasPermission("MANAGE_GUILD")) {
            let splitstr = args[0].value.split('/')
            let chnl = channel.client.channels.cache.get(splitstr[5])
            chnl.messages.fetch(splitstr[6]).then(msg => {
                msg.edit(args[1].value).then()
                constants.client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: `Edited message in ${chnl.name}`}}})
            })
        }
    }
}