const {client} = require("../constants");
const {Events, AuditLogEvent, EmbedBuilder} = require("discord.js");
const { log_channel } = require("./config/events.json")
const {getObjectDiff} = require("../commonFunctions");

client.on(Events.GuildEmojiUpdate, async (oldEmoji, newEmoji) => {

    let Embed = new EmbedBuilder()

    const audit = await oldEmoji.guild.fetchAuditLogs({
        type: AuditLogEvent.EmojiUpdate,
        limit: 1,
    });

    for (const [key, value] of Object.entries(getObjectDiff(oldEmoji, newEmoji))) {
        switch(value) {
            case 'name':
                Embed.addFields({
                    name: 'Name',
                    value: `Old Name: \`${oldEmoji.name}\`\nNew Name: \`${newEmoji.name}\``
                })
                break;
        }
    }


    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mEmoji = ${newEmoji.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setDescription(`Emoji \`${newEmoji.name}\` (${newEmoji.id}) was created`)
    Embed.setThumbnail(newEmoji.imageURL())
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})

    oldEmoji.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
})