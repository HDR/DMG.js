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
    execute: function (msg, args) {
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#FCBA03');
        Embed.setTitle("User Statistics");
        if (!args.length) {
            Embed.addField('User', msg.author.username + "#" + msg.author.discriminator, true);
            Embed.addField('ID', msg.author.id);
            Embed.addField('Join Date', new Date(msg.member.joinedAt).toDateString(), true);
            Embed.addField('Account Age', (new Date(Math.abs(msg.author.createdAt - Date.now()))/1000/60/60/24|0) + " Days", true)
            Embed.setImage(msg.author.avatarURL())
            msg.channel.send(embed=Embed)
        } else {
            let argStr = args.join(' ').replace(/\D+/g, '')
            let member = msg.guild.members.cache.get(argStr)
            if (msg.member.hasPermission("MANAGE_MESSAGES")) {
                if(member) {
                    Embed.addField('User', member.user.username + "#" + member.user.discriminator, true);
                    Embed.addField('ID', member.id);
                    Embed.addField('Join Date', new Date(member.joinedAt).toDateString(), true);
                    Embed.addField('Account Age', (new Date(Math.abs(member.user.createdAt - Date.now()))/1000/60/60/24|0) + " Days", true)
                    Embed.setImage(member.user.avatarURL)
                    msg.channel.send(embed=Embed)
                } else {msg.channel.send("I could not find that user, please try again")}
            } else {
                msg.channel.send("Only moderators and above may check the stats of others.")
            }

        }
    }
}