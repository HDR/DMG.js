const constants = require('../constants')
const Discord = require("discord.js");

constants.client.on('message', msg => {
    let cooldown = new Set();
    if (msg.guild === null) {
        let guild = constants.client.guilds.cache.get('246604458744610816');
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#0D22CC');
        Embed.setTitle('User Sent Message to DMG')
        Embed.addField('User:', msg.author.username + "#" + msg.author.discriminator, false)
        Embed.addField('Message:', msg.content);
        guild.channels.cache.get('477166711536091136').send(embed=Embed);
    }
    if(msg.author.id === '810698367310888980' && msg.content.startsWith("Hey ") && !cooldown.has(msg.author.id)){
        msg.channel.send("Hey <@!" + msg.author.id +  "> Good twilight.");
        cooldown.add(msg.author.id);
        setTimeout(() => {cooldown.delete(msg.author.id);}, 43200000)
    }
});