const {client} = require("../constants");
const {Events, EmbedBuilder} = require("discord.js");
const {log_channel} = require("./config/events.json");

client.on(Events.GuildMemberUpdate, async(oldMember, newMember) => {

    //Track Nickname Changes
    if(oldMember.nickname !== newMember.nickname) {
        let Embed = new EmbedBuilder();
        Embed.setAuthor({name: `${oldMember.user.tag}`, iconURL: `${newMember.user.displayAvatarURL()}`})
        Embed.setDescription(`<@${oldMember.user.id}>'s nickname was updated`)
        Embed.addFields(
            {
                name: 'New Name',
                value: `${newMember.displayName}`
            },
            {
                name: 'Old Name',
                value: `${oldMember.displayName}`
            },
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${oldMember.id}\`\`\``
            }
        )

        Embed.setTimestamp()
        Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
        await oldMember.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    }

    //Track Role Changes
    if(oldMember.roles.cache.difference(newMember.roles.cache).size > 0) {
        let Embed = new EmbedBuilder();
        Embed.setAuthor({name: `${oldMember.user.tag}`, iconURL: `${newMember.user.displayAvatarURL()}`})
        Embed.setDescription(`<@${oldMember.user.id}>'s roles were updated`)
        let diff = oldMember.roles.cache.difference(newMember.roles.cache)
        if(newMember.roles.cache.has(diff.first().id)) {
            Embed.addFields(
                {
                    name: 'Changes',
                    value: `➕ Added **${diff.first().name}**`
                }
            )
        } else {
            Embed.addFields(
                {
                    name: 'Changes',
                    value: `❌ Removed **${diff.first().name}**`
                }
            )
        }

        Embed.addFields(
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${oldMember.id}\n[0;37mRole = ${diff.first().id}\`\`\``
            }
        )
        Embed.setTimestamp()
        Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
        await oldMember.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    }

})