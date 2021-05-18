const Discord = require("discord.js");
const {client} = require("../constants");

client.on('channelCreate', async (channel) => {
    const audit = await client.guilds.cache.get('246604458744610816').fetchAuditLogs({limit: 1, type: "CHANNEL_CREATE"}).then();
    const Embed = new Discord.MessageEmbed();
    await Embed.setTitle("Channel Created");
    let Entry = audit.entries.first();
    if(!channel.type === 'dm') {
        Embed.addField('name', Entry.target.name, false)
        Embed.addField('type', Entry.target.type, true)
        Embed.addField('channel id', Entry.target.id, true)
        Embed.addField('User', `${Entry.executor.username}#${Entry.executor.discriminator}`)
        Embed.addField('User ID', Entry.executor.id)
        await client.guilds.cache.get('246604458744610816').channels.cache.get('477166711536091136').send(Embed);
    }
});