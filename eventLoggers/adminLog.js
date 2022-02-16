const {client} = require("../constants");
const {MessageEmbed} = require("discord.js");

//Ban Event
//client.on('guildBanAdd', async(guild, user) => {
//});

//Unban Event
//client.on('guildBanRemove', async(guild, user) => {
//});

//Kick Event
//client.on('guildMemberRemove', async(guild, user) => {
//});

//Member Timeout Event
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
    let guild = client.guilds.cache.get('246604458744610816');
    await guild.channels.cache.get('793348250526154783').send({embeds: [embed]});
}