const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, ChannelType} = require("discord.js");
const { log_channel } = require("./config/events.json")

client.on(Events.ChannelDelete, async(channel) => {

    const auditLog = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelDelete,
    });

    const auditEntry = auditLog.entries.first();

    const { executor } = auditEntry;

    if(auditEntry) {
        const Embed = new EmbedBuilder();
        Embed.setColor('#ff2828');
        Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
        Embed.setDescription(`${executor.tag} deleted a channel`)
        Embed.addFields(
            {
                name: 'Name',
                value: `${channel.name} (${channel.id})`
            },
            {
                name: 'Created At',
                value: `<t:${Math.trunc(channel.createdTimestamp/1000)}:F>`
            },
            {
                name: 'Type',
                value:  `${ChannelType[channel.type]}`,
                inline: false
            },
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${executor.id}\n[0;35mChannel = ${channel.id}\`\`\``,
                inline: false
            }
        )

        await channel.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    }
});