const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const {log_channel} = require("./config/events.json");



client.on(Events.GuildRoleCreate, async (role) => {

    const audit = await role.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleCreate,
    });

    let Embed = new EmbedBuilder()
    Embed.setColor('#333333')
    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setDescription(`Role \`${role.name}\` (${role.id}) was created`)
    Embed.addFields(
        {
            name: 'Name',
            value: `${role.name}`
        },
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mRole = ${role.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    role.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
})