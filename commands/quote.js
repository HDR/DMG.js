const Discord = require("discord.js");

module.exports = {
    name: 'quote',
    aliases: ['quote', 'q'],
    description: 'Quotes a discord message',
    execute: function (msg, args) {
        let argstr = args.join(' ')
        splitarg = argstr.split('/')
        let channel = msg.client.channels.cache.get(splitarg[5])
        channel.messages.fetch(splitarg[6]).then(fetchedMessage => {
            Embed = new Discord.MessageEmbed();
            Embed.setColor(fetchedMessage.member.displayHexColor)
            Embed.setAuthor(`${fetchedMessage.author.username}#${fetchedMessage.author.discriminator}`, fetchedMessage.author.avatarURL(), argstr)
            Embed.setDescription(fetchedMessage.content)
            Embed.setFooter(`#${fetchedMessage.channel.name} - ${fetchedMessage.createdAt}`)
            msg.channel.send(Embed)
        }).catch(console.error)
    }
}