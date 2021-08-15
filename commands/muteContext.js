const {client} = require("../constants");
const schedule = require('node-schedule');

module.exports = {
    name: 'Mute',
    type: 'USER',
    defaultPermission: false,

    execute: async function (interaction) {
        const member = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.targetId)
        if (!member.roles.cache.has('532947775147474979')){
            await member.roles.add(member.guild.roles.cache.find(role => role.id === '532947775147474979')).then();
            await interaction.reply({content: `${member.user.username}#${member.user.discriminator} Has been muted!`, ephemeral: true})
        } else {
            await member.roles.remove(member.guild.roles.cache.find(role => role.id === '532947775147474979')).then();
            await interaction.reply({content: `${member.user.username}#${member.user.discriminator} Has been unmuted!`, ephemeral: true})
        }


    }
}