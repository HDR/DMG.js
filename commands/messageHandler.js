const constants = require('../constants')
const Discord = require("discord.js");

constants.client.on('message', msg => {
    if (msg.guild === null) {
        let guild = constants.client.guilds.cache.get('246604458744610816');
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#0D22CC');
        Embed.setTitle('User Sent Message to DMG')
        Embed.addField('User:', msg.author.username + "#" + msg.author.discriminator, false)
        Embed.addField('Message:', msg.content);
        guild.channels.cache.get('477166711536091136').send(embed=Embed);
    }
    let imgur = ["IMGUR.COM/A/", "IMGUR.COM/GALLERY/"];
    if(imgur.some(v => msg.content.toUpperCase().includes(v))) {
        msg.channel.send(`The message posted by <@!${msg.author.id}> contains an imgur album link, it may have more than one image`)
    }
});