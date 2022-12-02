const { guildId, channelId } = require('./config/adminLog.json')
const {client} = require("../constants");
const {MessageEmbed} = require("discord.js");

client.on('guildMemberUpdate', async(oldMember, newMember) => {
    if(newMember.isCommunicationDisabled()) {
        const audit = await newMember.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_UPDATE'});
        const Embed = new MessageEmbed()
        Embed.setColor('#ff0000')
        Embed.setTitle(`${newMember.user.tag} has been timed out.`)
        Embed.addField('Reason', `${audit.entries.first().reason}`)
        Embed.addField('Executor', `${audit.entries.first().executor.tag}`)
        Embed.addField('Until', `<t:${Math.floor(newMember.communicationDisabledUntilTimestamp/1000)}:F>`)
        await log(Embed)
    }


});


async function log(embed) {
    let guild = client.guilds.cache.get(guildId);
    await guild.channels.cache.get(channelId).send({embeds: [embed]});
}