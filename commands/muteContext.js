const {client} = require("../constants");
const schedule = require('node-schedule');

module.exports = {
    name: 'Mute',
    type: 'USER',
    defaultPermission: false,

    execute: function (interaction) {
        const member = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id)
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        if (member.roles.cache.find(r => r.name === "Yokoi Watch" || r.name === "MGB")) {
            console.log(interaction)
           //if (user) {
           //    if(!user.roles.cache.has('532947775147474979')){
           //        user.roles.add(channel.guild.roles.cache.find(role => role.id === "532947775147474979")).then();
           //        let current = new Date();
           //        let date = new Date(current.getTime() + 86400000);
           //        const job = schedule.scheduleJob(date, function(){
           //            if(user.roles.cache.has('532947775147474979')){
           //                member.roles.remove(channel.guild.roles.cache.find(role => role.id === "532947775147474979")).then();
           //            }
           //        })
           //        interaction.reply('`<@!${user.id}> Was successfully warned with the following warning \\`${args[1].value}\\``', { ephemeral: true }).then(user.send(`You have been muted by the Game Boy Discord staff for 24 hours with the following message \`${args[1].value}\``));
           //    }
           //}  else {
           //    interaction.reply('Could not find that user in this guild', { ephemeral: true });
           //}
        }
    }
}