const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const {log_channel} = require("./config/events.json");
const moment = require("moment");

client.on(Events.GuildMemberUpdate, async(oldMember, newMember) => {

    const auditLog = await oldMember.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberUpdate,
    });

    let auditEntry = auditLog.entries.first();
    let { executor } = auditEntry;

    //Track people passing onboarding
    if(oldMember.pending && !newMember.pending) {
        let clear_time = moment.duration(moment(moment().now).diff(newMember.joinedAt))
        if(clear_time.seconds() > 20) {
            let Embed = new EmbedBuilder();
            Embed.setColor('#90EE90')
            Embed.setAuthor({name: `${oldMember.user.tag}`, iconURL: `${newMember.user.displayAvatarURL()}`})
            Embed.setDescription(`<@${oldMember.user.id}> Cleared the rules`)
            Embed.addFields({
                name: 'Time Taken:',
                value: clear_time.humanize()
            },
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${oldMember.id}\`\`\``
            })
            Embed.setTimestamp()

            await newMember.guild.channels.cache.get(log_channel).send({embeds: [Embed]})

        } else {
            try {
                await newMember.send({content: `[${oldMember.guild.name}] You have been automatically kicked, Please make sure you've read the rules properly.`})
            } catch(e) {
                console.log(e)
            }
            await newMember.kick('Cleared rules too fast')
        }
    }

    //Track Nickname Changes
    if(executor !== client.user){
        if(oldMember.nickname !== newMember.nickname) {
            let Embed = new EmbedBuilder();
            Embed.setAuthor({name: `${oldMember.user.tag}`, iconURL: `${newMember.user.displayAvatarURL()}`})
            Embed.setDescription(`<@${oldMember.user.id}>'s nickname was updated`)

            if(newMember.nickname) {
                let normalize = newMember.nickname.normalize("NFKC")
                if(normalize !== newMember.nickname) {
                    newMember.setNickname(normalize)
                }
            }

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
            Embed.setFooter({text: `${executor.username}#${executor.discriminator}`, iconURL: `${executor.avatarURL()}`})
            await oldMember.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
        }
    }

    //Check if user was timed out
    if(newMember.isCommunicationDisabled()) {
        const audit = await newMember.guild.fetchAuditLogs({limit: 1, type: 24});
        const Embed = new EmbedBuilder()
        Embed.setColor('#ff0000')
        Embed.setTitle(`${newMember.user.tag} has been timed out.`)
        await oldMember.guild.channels.cache.get(log_channel).send({embeds: [Embed]})
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