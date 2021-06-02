const { Permissions } = require("discord.js")
const {client} = require("../constants");

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
    execute: function (interaction) {
        const channel = client.guilds.cache.get(interaction.guildID).channels.cache.get(interaction.channelID);
        const member = client.guilds.cache.get(interaction.guildID).members.cache.get(interaction.user.id)
        if(member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            let splitstr = interaction.options[0].value.split('/')
            let chnl = channel.client.channels.cache.get(splitstr[5])
            chnl.messages.fetch(splitstr[6]).then(msg => {
                msg.edit(interaction.options[1].value).then()
                interaction.reply(`Edited message in ${chnl.name}`, { ephemeral: true });
            })
        }
    }
}