const { Permissions, MessageEmbed } = require("discord.js");
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
    execute: function (interaction) {
        const Embed = new MessageEmbed();
        Embed.setColor('#FCBA03');
        Embed.setTitle("User Statistics");
        const member = client.guilds.cache.get(interaction.guildID).members.cache.get(interaction.user.id)
        if (interaction.options.size === 0) {
            Embed.addField('User', `${member.user.username}#${member.user.discriminator}`, true);
            Embed.addField('ID', member.user.id);
            Embed.addField('Join Date', new Date(member.joinedAt).toDateString(), true);
            Embed.addField('Account Age', (new Date(Math.abs(member.user.createdAt - Date.now()))/1000/60/60/24|0) + " Days", true)
            Embed.addField('Avatar URL', member.user.avatarURL())
            Embed.setFooter(`Requested by ${member.user.username}#${member.user.discriminator}`)
            interaction.reply({ embeds: [Embed], ephemeral: true });

        } else {
            if (member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                let user = client.guilds.cache.get(interaction.guildID).members.cache.get(interaction.options.get('user').value)
                if(user) {
                    Embed.addField('User', user.user.username + "#" + user.user.discriminator, true);
                    Embed.addField('ID', user.id);
                    Embed.addField('Join Date', new Date(user.joinedAt).toDateString(), true);
                    Embed.addField('Account Age', (new Date(Math.abs(user.user.createdAt - Date.now()))/1000/60/60/24|0) + " Days", true)
                    interaction.reply({ embeds: [Embed], ephemeral: true });
                } else {interaction.reply('I could not find that user, please try again', { ephemeral: true });}
            } else {
                interaction.reply('Only moderators and above may check the stats of others', { ephemeral: true });
            }

        }
    }
}