const {client} = require("../constants");
const { EmbedBuilder, Collection, Events } = require("discord.js");
const { log_channel } = require("./config/inviteTracker.json")

const guildInvites = new Collection();

client.on(Events.InviteCreate, async invite => {
    guildInvites.get(invite.guild.id).set(invite.code, invite.uses)
    const Embed = new EmbedBuilder();
    Embed.setColor('#ffd400');
    Embed.setTitle("User created new invite")
    Embed.addFields({name: 'User', value: `${invite.inviter.username}#${invite.inviter.discriminator}`}, {name: 'Code', value: invite.code})
    await invite.guild.channels.cache.get(log_channel).send({embeds: [Embed]});

})

client.on(Events.InviteDelete, (invite) => {
    guildInvites.get(invite.guild.id).delete(invite.code)
})

client.on(Events.ClientReady, () => {
    client.guilds.cache.forEach(async guild => {
        const firstInvites = await guild.invites.fetch();
        guildInvites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
    })
})

client.on(Events.GuildMemberAdd, async member => {

    const newInvites = await member.guild.invites.fetch();
    const oldInvites = guildInvites.get(member.guild.id)
    const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));

    const Embed = new EmbedBuilder();
    Embed.setColor('#00ffff');
    Embed.setTitle("User Joined Server");
    Embed.addFields({name: 'User', value: `${member.user.tag}`, inline: false}, {name: 'User ID', value: member.user.id})

    if(typeof invite === 'undefined') {
        Embed.addFields({name: 'Invite Code:', value: 'gameboy'})
        await member.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    } else {
        const inviter = await client.users.fetch(invite.inviter.id)
        Embed.addFields({name: 'Invite Code:', value: invite.code, inline: true}, {name: 'Invited By:', value: `${inviter.tag}`, inline: true})
        await member.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    }
});