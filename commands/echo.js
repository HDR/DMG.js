const { Permissions } = require("discord.js")
module.exports = {
    name: 'echo',
    aliases: ['echo'],
    description: '[Admin] Echo a message as the bot',
    options: [
        {
            "name": "channel",
            "description": "Target channel",
            "type": 'CHANNEL',
            "required": true
        },
        {
            "name": "message",
            "description": "Message Content",
            "type": 'INTEGER',
            "required": true
        }
    ],
    choices: [],
    execute: function (interaction) {
        const member = client.guilds.cache.get(interaction.guildID).members.cache.get(interaction.user.id)
        const channel = client.guilds.cache.get(interaction.guildID).channels.cache.get(interaction.channelID);
        if(member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            let channelid = interaction.options[0].value.replace(/[#<>]/g, '')
            let chnl = channel.client.channels.cache.get(channelid)
            chnl.send(interaction.options[1].value)
            interaction.reply(`Echoed message to ${chnl.name}`, { ephemeral: true });
        }
    }
}