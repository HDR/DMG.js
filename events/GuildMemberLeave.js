const {client} = require("../constants");
const {Events, EmbedBuilder} = require("discord.js");
const { log_channel } = require("./config/events.json")

client.on(Events.GuildMemberRemove, async(member) => {

    const Embed = new EmbedBuilder();
    Embed.setColor('#ff2828');
    Embed.setDescription(`<@${member.user.id}> left the server`)
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
            value: `<t:${Math.trunc(member.joinedTimestamp/1000)}:F>`,
            inline: true
        },
        {
            name: 'Created At',
            value: `<t:${Math.trunc(member.user.createdTimestamp/1000)}:F>`,
            inline: true
        },
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mMember = ${member.user.id}\n[0;34mGuild = ${member.guild.id}\`\`\``,
            inline: false
        }
    )

    await member.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
});