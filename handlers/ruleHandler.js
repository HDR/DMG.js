const Discord = require("discord.js");
const {client} = require("../constants");

// Track reactions to check if user has accepted the rules
client.on('messageReactionAdd', (reaction, member) => {
    if (reaction.message.channel.id === "867432671491391569"){
        console.log(reaction)
        if (reaction.emoji.name === "👍") {
            reaction.message.guild.members.fetch(member.id).then((discordUser) => {
                discordUser.send("Thank you for confirming that you've not actually read the rules, if you want to get access to the rest of the server, please read the rules properly.").then();
            })
        }

        if (reaction.emoji.name === "cartridge") {
            reaction.message.guild.members.fetch(member.id).then((discordUser) => {
                const Embed = new Discord.MessageEmbed();
                Embed.setColor('#34EB4F');
                Embed.setTitle('User Cleared #rules')
                Embed.addField('User:', member.username + "#" + member.discriminator, false)
                let dateDiff = new Date(Math.abs(discordUser.joinedAt - Date.now()))
                Embed.addField('Time:', dateDiff.getHours() - 1 + " Hours " + dateDiff.getMinutes() + " Minutes " + dateDiff.getSeconds() + " Seconds");
                if (dateDiff.getTime() / 1000 < 30){
                    member.send("Woah there, looks like you're in a hurry, please make sure you have read the rules properly.").catch();
                } else {
                    discordUser.roles.add(discordUser.guild.roles.cache.find(role => role.id === "1001801004007825408")).then();
                    discordUser.guild.channels.cache.get('477166711536091136').send({ embeds: [Embed]});
                }
            })
        } else {
            if (reaction.emoji.name !== "cartridge") {
                reaction.message.guild.members.fetch(member.id).then((discordUser) => {
                    const Embed = new Discord.MessageEmbed();
                    Embed.setColor('#fc1303');
                    Embed.setTitle('User used wrong emoji in #rules')
                    Embed.addField('User:', member.username + "#" + member.discriminator, false)
                    Embed.addField('Emoji Used:', reaction._emoji.name)
                    discordUser.guild.channels.cache.get('477166711536091136').send({embeds: [Embed]});
                    discordUser.timeout(2 * 60 * 1000, 'Take some time to read the rules and try again in 2 minutes.').then();
                })
            }
        }
        if(!member.bot) {
            reaction.remove().then();
        }
    }
})