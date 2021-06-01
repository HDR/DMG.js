const {client} = require("../constants");

module.exports = {
    name: 'discordplays',
    aliases: ['discordplays'],
    description: 'Join or leave the #discord-plays channel',
    options: [],
    choices: [],
    execute: function (channel, args, member, interaction) {
        let guild = client.guilds.cache.get('246604458744610816');
        if(!member.roles.cache.has('836221224584871968')){
            if(!member.roles.cache.has('837715471599927316')) {
                member.roles.add(guild.roles.cache.find(role => role.id === "836221224584871968")).then();
                interaction.reply('You can now see the discord-plays channel', { ephemeral: true });
            } else {
                interaction.reply('You can not access the discord-plays channel as you have been banned from it.', { ephemeral: true });
            }
        } else {
            member.roles.remove(guild.roles.cache.find(role => role.id === "836221224584871968")).then();
            interaction.reply('You can no longer see the discord-plays channel', { ephemeral: true });
        }
    }
}