const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, PermissionsBitField } = require("discord.js");
const {log_channel} = require("./config/events.json");
const _ = require('lodash');


client.on(Events.GuildUpdate, async (oldGuild, newGuild) => {
    let Embed = new EmbedBuilder()

    const audit = await oldGuild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.GuildUpdate,
    });


    Embed.setDescription(`Guild \`${oldGuild.name}\` (${newGuild.id}) was updated`)
    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mGuild = ${oldGuild.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    oldGuild.channels.cache.get(log_channel).send({embeds: [Embed]});
})