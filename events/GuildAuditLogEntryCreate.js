const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const { log_channel } = require("./config/events.json")

client.on(Events.GuildAuditLogEntryCreate, async (auditLog, guild) => {

    const { action, actionType, changes, createdAt, createdTimestamp, executor, executorId, extra, id, reason, target, targetId, targetType  } = await auditLog;

    const Embed = new EmbedBuilder();

    //Embed.addFields(
    //    {
    //        name: 'User Information',
    //        value: `${member.user.tag} (${member.user.id}) <@${member.user.id}>`,
    //        inline: false
    //    },
    //    {
    //        name: 'Roles',
    //        value: `\`\`\`${member.roles.cache.map(r => `${r.name}`)}\`\`\``,
    //        inline: false
    //    },
    //    {
    //        name: 'Joined At',
    //        value: `<t:${Math.trunc(member.joinedTimestamp/1000)}:F>`,
    //        inline: true
    //    },
    //    {
    //        name: 'Created At',
    //        value: `<t:${Math.trunc(member.user.createdTimestamp/1000)}:F>`,
    //        inline: true
    //    }
    //)

    switch(await action) {
        //----------------Channel actions----------------\\
        case AuditLogEvent.ChannelCreate:
            //Channel was created
            break;

        case AuditLogEvent.ChannelDelete:
            //Channel was deleted
            break;

        case AuditLogEvent.ChannelUpdate:
            //Channel was updated
            break;
        //-----------------------------------------------\\


        //----------------Emoji actions----------------\\
        case AuditLogEvent.EmojiCreate:
            //Emoji was created
            break;

        case AuditLogEvent.EmojiDelete:
            //Emoji was deleted
            break;

        case AuditLogEvent.EmojiUpdate:
            //Emoji was updated
            break;
        //---------------------------------------------\\


        //----------------Member actions----------------\\
        case AuditLogEvent.MemberKick:
            await console.log(await guild.members.cache.get('177012181416542209'))
            //Embed.setAuthor({name: `${target.username}`, iconURL: `${target.displayAvatarURL()}`})
            //Embed.setDescription(`<@${targetId}> was kicked by ${executor.tag} (${executor.id})`)
            //Embed.addFields(
            //    {
            //        name: 'User Information',
            //        value: `${target.username} (${targetId}) <@${targetId}>`,
            //        inline: false
            //    },
            //    {
            //        name: 'Roles',
            //        value: `\`\`\`${member.roles.cache.map(r => `${r.name}`)}\`\`\``,
            //        inline: false
            //    },
            //    {
            //        name: 'Joined At',
            //        value: `<t:${Math.trunc(member.joinedTimestamp/1000)}:F>`,
            //        inline: true
            //    },
            //    {
            //        name: 'Created At',
            //        value: `<t:${Math.trunc(target.createdTimestamp/1000)}:F>`,
            //        inline: true
            //    },
            //    {
            //        name: 'Reason',
            //        value: reason,
            //        inline: false
            //    },
            //    {
            //        name: 'ID',
            //        value: `\`\`\`ansi\n[0;33mMember = ${targetId}\n[0;34mGuild = ${guild.id}\`\`\``,
            //        inline: false
            //    }
//
            //)
            //
            break;

        case AuditLogEvent.MemberBanAdd:

            console.log(await client.users.fetch(targetId))

            //Embed.setAuthor({name: `${target.username}`, iconURL: `${target.displayAvatarURL()}`})
            //Embed.setDescription(`<@${guild.members.cache.get(targetId).user.id}> was banned by ${executor.tag} (${executor.id})`)
            //Embed.addFields(
            //    {
            //        name: 'User Information',
            //        value: `${target.username} (${targetId}) <@${targetId}>`,
            //        inline: false
            //    },
            //    {
            //        name: 'Roles',
            //        value: `\`\`\`${guild.members.cache.get(targetId).roles.cache.map(r => `${r.name}`)}\`\`\``,
            //        inline: false
            //    },
            //    {
            //        name: 'Joined At',
            //        value: `<t:${Math.trunc(guild.members.cache.get(targetId).joinedTimestamp/1000)}:F>`,
            //        inline: true
            //    },
            //    {
            //        name: 'Created At',
            //        value: `<t:${Math.trunc(guild.members.cache.get(targetId).user.createdTimestamp/1000)}:F>`,
            //        inline: true
            //    },
            //    {
            //        name: 'Reason',
            //        value: reason,
            //        inline: false
            //    },
            //    {
            //        name: 'ID',
            //        value: `\`\`\`ansi\n[0;33mMember = ${targetId}\n[0;34mGuild = ${guild.id}\`\`\``,
            //        inline: false
            //    }
//
            //)
            break;

        case AuditLogEvent.MemberBanRemove:
            Embed.setAuthor({name: `${target.username}`, iconURL: `${target.displayAvatarURL()}`})
            Embed.setDescription(`<@${guild.members.cache.get(targetId).user.id}> was unbanned by ${executor.tag} (${executor.id})`)
            Embed.addFields(
                {
                    name: 'User Information',
                    value: `${target.username} (${targetId}) <@${targetId}>`,
                    inline: false
                },
                {
                    name: 'ID',
                    value: `\`\`\`ansi\n[0;33mMember = ${targetId}\n[0;34mGuild = ${guild.id}\`\`\``,
                    inline: false
                }

            )
            break;
        //---------------------------------------------\\
    }

    //await guild.channels.cache.get(log_channel).send({embeds: [Embed]});
});