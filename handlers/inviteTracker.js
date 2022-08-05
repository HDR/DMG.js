const {client} = require("../constants");
const Discord = require("discord.js");

const guildInvites = new Map();

client.on('inviteCreate', async invite => {
    if(invite.guild.id === '246604458744610816') {
        const invites = await invite.guild.invites.fetch();

        const codeUses = new Map();
        invites.each(inv => codeUses.set(inv.code, inv.uses));

        guildInvites.set(invite.guild.id, codeUses);

        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#ffd400');
        Embed.setTitle("User created new invite")
        Embed.addField("User", `${invite.inviter.username}#${invite.inviter.discriminator}`)
        Embed.addField("Code", invite.code)
        await invite.guild.channels.cache.get('477166711536091136').send({embeds: [Embed]});
    }

})

client.once('ready', () => {
    client.guilds.cache.forEach(guild => {
        if(guild.id === '246604458744610816') {
            guild.invites.fetch()
                .then(invites => {
                    const codeUses = new Map();
                    invites.each(inv => codeUses.set(inv.code, inv.uses));

                    guildInvites.set(guild.id, codeUses);
                })
                .catch(err => {
                    console.log("OnReady Error:", err)
                })
        }
    })
})

client.on('guildMemberAdd', async member => {
    const cachedInvites = guildInvites.get(member.guild.id)
    const newInvites = await member.guild.invites.fetch();
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);

        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#00ffff');
        Embed.setTitle("User Joined Server");
        Embed.addField('User:', `${member.user.username}#${member.user.discriminator}`, false);
        Embed.addField('User ID', member.user.id)

        if(typeof usedInvite === 'undefined' && !usedInvite) {
            Embed.addField('Invite Code:', 'gameboy');
            await member.guild.channels.cache.get('477166711536091136').send({embeds: [Embed]});
        } else {
            Embed.addField('Invite Code:', usedInvite.code);
            await member.guild.channels.cache.get('477166711536091136').send({embeds: [Embed]});
        }

    } catch (err) {
        console.log("OnGuildMemberAdd Error:", err)
    }

    newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
    guildInvites.set(member.guild.id, cachedInvites);
});