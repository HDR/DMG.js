const Discord = require("discord.js");

module.exports = {
    name: 'stats',
    aliases: ['me', 'ustats'],
    description: 'Displays user statistics',
    options: [
        {
            "name": "user",
            "description": "Get another user's stats",
            "type": 6 ,
            "required": false
        }
    ],
    choices: [],
    execute: function (channel, args, member) {
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#FCBA03');
        Embed.setTitle("User Statistics");
        if (typeof args === 'undefined') {
            Embed.addField('User', `${member.user.username}#${member.user.discriminator}`, true);
            Embed.addField('ID', member.user.id);
            Embed.addField('Join Date', new Date(member.joinedAt).toDateString(), true);
            Embed.addField('Account Age', (new Date(Math.abs(member.user.createdAt - Date.now()))/1000/60/60/24|0) + " Days", true)
            Embed.setImage(member.user.avatarURL())
            Embed.setFooter(`Requested by ${member.user.username}#${member.user.discriminator}`)
            channel.send(embed=Embed)
        } else {
            let user = channel.guild.members.cache.get(args[0].value)
            if (member.hasPermission("MANAGE_MESSAGES")) {
                if(user) {
                    Embed.addField('User', user.user.username + "#" + user.user.discriminator, true);
                    Embed.addField('ID', user.id);
                    Embed.addField('Join Date', new Date(user.joinedAt).toDateString(), true);
                    Embed.addField('Account Age', (new Date(Math.abs(user.user.createdAt - Date.now()))/1000/60/60/24|0) + " Days", true)
                    Embed.setImage(user.user.avatarURL)
                    Embed.setFooter(`Requested by ${member.user.username}#${member.user.discriminator}`)
                    channel.send(embed=Embed)
                } else {channel.send(`<@!${member.id}> I could not find that user, please try again`)}
            } else {
                channel.send(`<@!${member.id}> Only moderators and above may check the stats of others.`)
            }

        }
    }
}