const {client} = require("../constants");
const Discord = require("discord.js");

client.on('message', msg => {
    let cooldown = new Set();
    if (msg.guild === null) {
        let guild = client.guilds.cache.get('246604458744610816');
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#0D22CC');
        if(msg.author.bot){
            Embed.setTitle('DMG Sent Message to User')
        } else {
            Embed.setTitle('User Sent Message to DMG')
            Embed.addField('User:', msg.author.username + "#" + msg.author.discriminator, false)
        }
        Embed.addField('Message:', msg.content);
        guild.channels.cache.get('477166711536091136').send(Embed);
    }
    if(msg.author.id === '133362069637562369' && msg.content.startsWith("Hey") && !cooldown.has(msg.author.id)){
        msg.channel.send(`Hey <@!${msg.author.id}> Good twilight.`)
        cooldown.add(msg.author.id);
        setTimeout(() => {cooldown.delete(msg.author.id);}, 43200000)
    }
});