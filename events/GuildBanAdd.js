const {client} = require("../constants");
const {AuditLogEvent, EmbedBuilder, Events} = require('discord.js');
const { log_channel } = require("./config/events.json")


client.on(Events.GuildBanAdd, async (guildban) => {

    const audit = await guildban.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd,
        limit: 1,
    });

    let Embed = new EmbedBuilder()
    Embed.setColor('#333333')
    Embed.setAuthor({name: `${guildban.user.tag}`, iconURL: `${guildban.user.displayAvatarURL()}`})
    Embed.setDescription(`**${guildban.user.tag}** was banned`)
    Embed.addFields(
        {
            name: 'User Information',
            value: `${guildban.user.tag} (${guildban.user.id}) <@${guildban.user.id}>`
        },
        {
            name: 'Reason',
            value: `${audit.entries.first().reason}`
        },
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mMember = ${guildban.user.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})

    guildban.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
})