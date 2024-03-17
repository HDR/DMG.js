const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const { log_channel } = require("./config/events.json")

client.on(Events.GuildMemberRemove, async(member) => {

    member.guild.bans.fetch(member.id).then(e=> {}).catch(async e => {
        const auditLog = await member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick
        });

        const auditEntry = auditLog.entries.first();
        const {executor, target, reason, actionType} = auditEntry;

        const Embed = new EmbedBuilder();
        Embed.setColor('#ff2828');
        Embed.setAuthor({name: `${member.user.tag}`, iconURL: `${member.displayAvatarURL()}`})
        Embed.addFields(
            {
                name: 'User Information',
                value: `${member.user.tag} (${member.user.id}) <@${member.user.id}>`,
                inline: false
            },
            {
                name: 'Roles',
                value: `\`\`\`${member.roles.cache.map(r => `${r.name}`)}\`\`\``,
                inline: false
            },
            {
                name: 'Joined At',
                value: `<t:${Math.trunc(member.joinedTimestamp / 1000)}:F>`,
                inline: true
            },
            {
                name: 'Created At',
                value: `<t:${Math.trunc(member.user.createdTimestamp / 1000)}:F>`,
                inline: true
            }
        )

        if (!auditEntry) {
            Embed.setDescription(`<@${member.user.id}> left the server`)
        } else {
            if (target.id === member.id && auditEntry.createdAt > member.joinedAt && auditEntry.action === AuditLogEvent.MemberKick) {
                Embed.setDescription(`<@${member.user.id}> was kicked by ${executor.tag} (${executor.id})`)
                Embed.addFields(
                    {
                        name: 'Reason',
                        value: reason,
                        inline: false
                    })
            } else {
                Embed.setDescription(`<@${member.user.id}> left the server`)
            }
        }

        Embed.addFields(
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${member.user.id}\n[0;34mGuild = ${member.guild.id}\`\`\``,
                inline: false
            }
        )


        Embed.setTimestamp()
        Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
        await member.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    })
});