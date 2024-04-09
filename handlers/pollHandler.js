const {client} = require("../constants");
const {Events, PermissionsBitField} = require('discord.js');

client.on(Events.Raw, async (packet) => {
    if (packet.d.poll) {
        let channel = await client.channels.fetch(packet.d.channel_id)
        let message = await channel.messages.fetch(packet.d.id)
        if(!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild) && !message.author.bot) {
            await message.author.send({content: `[${message.guild.name}]: Users are not allowed to create polls in this server`}).catch(err => {
                if(message.guild) {
                    message.reply({content: 'Users are not allowed to create polls in this server'})
                }
            })
            await message.delete()
        }
    }
})