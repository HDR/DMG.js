const { guildId, channelId } = require('./config/adminLog.json')
const {client} = require("../constants");
const { EmbedBuilder, Events } = require("discord.js");

client.on(Events.GuildMemberUpdate, async(oldMember, newMember) => {
    if(newMember.isCommunicationDisabled()) {
        const audit = await newMember.guild.fetchAuditLogs({limit: 1, type: 24});
        const Embed = new EmbedBuilder()
        Embed.setColor('#ff0000')
        Embed.setTitle(`${newMember.user.tag} has been timed out.`)
        Embed.addFields({name:'Reason', value: `${audit.entries.first().reason}`}, {name:'Executor', value: `${audit.entries.first().executor.tag}`}, {name: 'Until', value: `<t:${Math.floor(newMember.communicationDisabledUntilTimestamp/1000)}:F>`})
        await log(Embed)
    }


});


async function log(embed) {
    let guild = client.guilds.cache.get(guildId);
    await guild.channels.cache.get(channelId).send({embeds: [embed]});
}