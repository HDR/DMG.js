const { Permissions } = require("discord.js")
const {client} = require("../constants");

module.exports = {
    name: 'edit',
    description: 'Edit a message posted by the bot',
    defaultPermission: false,
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
    execute: function (interaction) {
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        const member = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id)
        if(member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            let splitstr = interaction.options.get('url').value.split('/')
            let chnl = channel.client.channels.cache.get(splitstr[5])
            chnl.messages.fetch(splitstr[6]).then(msg => {
                msg.edit(interaction.options.get('contents').value).then()
                interaction.reply(`Edited message in ${chnl.name}`, { ephemeral: true });
            })
        }
    }
}