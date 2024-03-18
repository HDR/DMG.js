const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, PermissionsBitField } = require("discord.js");
const {log_channel} = require("./config/events.json");
const {getObjectDiff} = require("../commonFunctions");


client.on(Events.GuildUpdate, async (OldGuild, NewGuild) => {
    let Embed = new EmbedBuilder()

    const audit = await OldGuild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.GuildUpdate,
    });

    for (const [key, value] of Object.entries(getObjectDiff(OldGuild, NewGuild))) {
        switch (value) {
            case 'name':
                Embed.addFields({
                    name: 'Name',
                    value: `Old Name: \`${OldGuild.name}\`\nNew Name: \`${NewGuild.name}\``
                })
                break;

            case 'premiumProgressBarEnabled':
                Embed.addFields({
                    name: 'Boost Progress Bar',
                    value: `Old State: \`${OldGuild.premiumProgressBarEnabled}\`\nNew State: \`${NewGuild.premiumProgressBarEnabled}\``
                })
                break;

            case 'systemChannelFlags':
                Embed.addFields({
                    name: 'System Channel Flags',
                    value: `Old State: \`${OldGuild.systemChannelFlags}\`\nNew State: \`${NewGuild.systemChannelFlags}\``
                })
                break;
        }
    }


    Embed.setDescription(`Guild \`${NewGuild.name}\` (${NewGuild.id}) was updated`)
    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mGuild = ${OldGuild.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    OldGuild.channels.cache.get(log_channel).send({embeds: [Embed]});
})