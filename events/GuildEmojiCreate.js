const {client} = require("../constants");
const {Events, AuditLogEvent, EmbedBuilder} = require("discord.js");
const { log_channel } = require("./config/events.json")

client.on(Events.GuildEmojiCreate, async (emoji ) => {

    const audit = await emoji.guild.fetchAuditLogs({
        type: AuditLogEvent.EmojiUpdate,
        limit: 1,
    });

    let Embed = new EmbedBuilder()
    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mEmoji = ${emoji.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setDescription(`Emoji \`${emoji.name}\` (${emoji.id}) was created`)
    Embed.setThumbnail(emoji.imageURL())
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    emoji.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
})