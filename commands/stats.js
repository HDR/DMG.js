const { Permissions, MessageEmbed } = require("discord.js");
const {client} = require("../constants");

module.exports = {
    name: 'stats',
    description: 'Displays user statistics',
    options: [
        {
            "name": "user",
            "description": "Get another user's stats",
            "type": 'USER',
            "required": false
        }
    ],
    execute: async function (interaction) {
        const Embed = new MessageEmbed();
        Embed.setColor('#FCBA03');
        Embed.setTitle("User Statistics");
        const member = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id)
        if ((interaction.options.get('user') === null)) {Embed.addFields({name: 'User', value: `${member.user.username}#${member.user.discriminator}`, inline: true}, {name: 'ID', value: member.user.id, inline: true}, {name: '‎', value: '‎', inline: true}, {name: 'Join Date', value: new Date(member.joinedAt).toDateString(), inline: true}, {name: 'Account Age', value: `${(new Date(Math.abs(member.user.createdAt - Date.now()))/1000/60/60/24|0)} Days`, inline: true}, {name: '‎', value: '‎', inline: true}, {name: 'Avatar URL', value: member.user.avatarURL()})
            interaction.reply({ embeds: [Embed], ephemeral: true });

        } else {
            if (member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                let user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.get('user').value)
                if(await user) {
                    Embed.addFields({name: 'User', value: `${user.user.username}#${user.user.discriminator}`, inline: true}, {name: 'ID', value: user.id, inline: true}, {name: '‎', value: '‎', inline: true}, {name: 'Join Date', value: new Date(user.joinedAt).toDateString(), inline: true}, {name: 'Account Age', value: `${(new Date(Math.abs(user.user.createdAt - Date.now()))/1000/60/60/24|0)} Days`, inline: true}, {name: '‎', value: '‎', inline: true})
                    await interaction.reply({ embeds: [Embed], ephemeral: true });
                } else {interaction.reply('I could not find that user, please try again', { ephemeral: true });}
            } else {
                interaction.reply('Only moderators and above may check the stats of others', { ephemeral: true });
            }

        }
    }
}