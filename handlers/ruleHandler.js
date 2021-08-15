const Discord = require("discord.js");
const {client} = require("../constants");

// Add rank to users as they join to limit access to channels until they accept the rules
client.on('guildMemberAdd', async (member) => {
    const Embed = new Discord.MessageEmbed();
    console.log(member.user)
    Embed.setColor('#34EB4F');
    Embed.setTitle('User Joined Server')
    Embed.addField('User:', `${member.user.username}#${member.user.discriminator}`, false)
    //Embed.addField('Joined At', member.joinedAt);
    //Embed.addField('Created At', member.user.createdAt);
    Embed.addField('User ID', member.user.id)
    await client.guilds.cache.get('246604458744610816').channels.cache.get('477166711536091136').send({ embeds: [Embed]});
    await member.roles.add(member.guild.roles.cache.find(role => role.id === "786733810897125407")).then();
});

// Track reactions to check if user has accepted the rules
client.on('messageReactionAdd', (reaction, member) => {
    if (reaction.message.channel.id === "867432671491391569"){
        if (reaction.emoji.name === "pokeball") {
            reaction.message.guild.members.fetch(member.id).then((discordUser) => {
                if (discordUser.roles.cache.has("786733810897125407")){
                    const Embed = new Discord.MessageEmbed();
                    Embed.setColor('#34EB4F');
                    Embed.setTitle('User Cleared #rules')
                    Embed.addField('User:', member.username + "#" + member.discriminator, false)
                    let dateDiff = new Date(Math.abs(discordUser.joinedAt - Date.now()))
                    Embed.addField('Time:', dateDiff.getHours() - 1 + " Hours " + dateDiff.getMinutes() + " Minutes " + dateDiff.getSeconds() + " Seconds");
                    if (dateDiff.getTime() / 1000 < 60){
                        member.send("Woah there, looks like you're in a hurry, please make sure you have read the rules properly.").then();
                    } else {
                        discordUser.roles.remove(discordUser.guild.roles.cache.find(role => role.id === "786733810897125407")).then();
                        discordUser.guild.channels.cache.get('477166711536091136').send({ embeds: [Embed]});
                    }
                }
            })
        } else {
            reaction.message.guild.members.fetch(member.id).then((discordUser) => {
                const Embed = new Discord.MessageEmbed();
                Embed.setColor('#fc1303');
                Embed.setTitle('User used wrong emoji in #rules')
                Embed.addField('User:', member.username + "#" + member.discriminator, false)
                Embed.addField('Emoji Used:', reaction.emoji)
                discordUser.guild.channels.cache.get('477166711536091136').send({ embeds: [Embed]});
            })
        }
        reaction.remove().then();
    }
})