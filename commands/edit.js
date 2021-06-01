const { Permissions } = require("discord.js")
module.exports = {
    name: 'edit',
    aliases: ['edit'],
    description: 'Edit a message posted by the bot',
    options: [
        {
            "name": "url",
            "description": "Link to message you want to edit",
            "type": 'STRING',
            "required": true
        },
        {
            "name": "contents",
            "description": "New message contents",
            "type": 'STRING',
            "required": true
        }
    ],
    choices: [],
    execute: function (channel, args, member, interaction) {
        if(member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            let splitstr = args[0].value.split('/')
            let chnl = channel.client.channels.cache.get(splitstr[5])
            chnl.messages.fetch(splitstr[6]).then(msg => {
                msg.edit(args[1].value).then()
                interaction.reply(`Edited message in ${chnl.name}`, { ephemeral: true });
            })
        }
    }
}