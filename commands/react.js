const {client} = require("../constants");

module.exports = {
    name: 'react',
    description: 'React to a message',
    defaultPermission: false,
    options: [
        {
            "name": "url",
            "description": "Link to message you want to react to",
            "type": 'STRING',
            "required": true
        },
        {
            "name": "contents",
            "description": "Emoji",
            "type": 'STRING',
            "required": true
        }
    ],
    execute: function (interaction) {
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        let splitstr = interaction.options.get('url').value.split('/')
        let chnl = channel.client.channels.cache.get(splitstr[5])
        chnl.messages.fetch(splitstr[6]).then(msg => {
            msg.react(interaction.options.get('contents').value).then()
            interaction.reply({content: `Reacted to message in ${chnl.name}`, ephemeral: true});
        })
    }
}