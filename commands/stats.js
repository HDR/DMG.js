const Discord = require("discord.js");
const {client} = require("../constants");

module.exports = {
    name: 'stats',
    aliases: ['me', 'ustats'],
    description: 'Displays user statistics',
    options: [
        {
            "name": "user",
            "description": "Get another user's stats",
            "type": 'USER',
            "required": false
        }
    ],
    choices: [],
    execute: function (channel, args, member, interaction) {
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#FCBA03');
        Embed.setTitle("User Statistics");
        if (typeof args === 'undefined') {
            Embed.addField('User', `${member.user.username}#${member.user.discriminator}`, true);
            Embed.addField('ID', member.user.id);
            Embed.addField('Join Date', new Date(member.joinedAt).toDateString(), true);
            Embed.addField('Account Age', (new Date(Math.abs(member.user.createdAt - Date.now()))/1000/60/60/24|0) + " Days", true)
            Embed.addField('Avatar URL', member.user.avatarURL())
            Embed.setFooter(`Requested by ${member.user.username}#${member.user.discriminator}`)
            interaction.reply(Embed, { ephemeral: true });

        } else {
            let user = channel.guild.members.cache.get(args[0].value)
            if (member.hasPermission("MANAGE_MESSAGES")) {
                if(user) {
                    Embed.addField('User', user.user.username + "#" + user.user.discriminator, true);
                    Embed.addField('ID', user.id);
                    Embed.addField('Join Date', new Date(user.joinedAt).toDateString(), true);
                    Embed.addField('Account Age', (new Date(Math.abs(user.user.createdAt - Date.now()))/1000/60/60/24|0) + " Days", true)
                    Embed.setFooter(`Requested by ${member.user.username}#${member.user.discriminator}`)
                    interaction.reply(Embed, { ephemeral: true });
                } else {interaction.reply('I could not find that user, please try again', { ephemeral: true });}
            } else {
                interaction.reply('Only moderators and above may check the stats of others', { ephemeral: true });
            }

        }
    }
}