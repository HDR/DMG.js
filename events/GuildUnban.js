const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const { log_channel } = require("./config/events.json")

client.on(Events.GuildAuditLogEntryCreate, async (auditLog, guild) => {
    const {action, executor, targetId} = auditLog;
    if(action === AuditLogEvent.MemberBanRemove) {
        const targetUser = await client.users.fetch(targetId)
        let Embed = new EmbedBuilder()
        Embed.setColor('#333333')
        Embed.setAuthor({name: `${targetUser.tag}`, iconURL: `${targetUser.displayAvatarURL()}`})
        Embed.setDescription(`**${targetUser.tag}** was unbanned`)
        Embed.addFields(
            {
                name: 'User Information',
                value: `${targetUser.tag} (${targetUser.id}) <@${targetUser.id}>`
            },
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${targetUser.id}\n[0;34mPerpetrator = ${executor.id}\`\`\``
            }
        )
        Embed.setTimestamp()
        Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})

        guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    }
});