const {client} = require("../constants");

module.exports = {
    name: 'letmegooglethat',
    aliases: ['lmgt'],
    description: 'Let me google that link generator, for people that are unable to use gogole',
    options: [
        {
            "name": "search",
            "description": "what do you want to google?",
            "type": 'STRING',
            "required": true
        }
    ],
    choices: [],
    execute: function (channel, args, member, interaction) {
        interaction.reply(`https://letmegooglethat.com/?q=${args[0].value.split(' ').join('+')}`, { ephemeral: true });
    }
}