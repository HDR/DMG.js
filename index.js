const {client} = require("./constants");
const Discord = require('discord.js')
const { token, permissions } = require('./config.json')
const fs = require('fs')
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const handlers = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
const eventLoggers = fs.readdirSync('./eventLoggers').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
    client.api.applications('419539233850785792').commands.post({data: {
            name: command.name,
            description: command.description,
            options: command.options
       }}).then()
}

for (const file of handlers) {
    require(`./handlers/${file}`);
}

for (const file of eventLoggers) {
    require(`./eventLoggers/${file}`);
}


client.ws.on('INTERACTION_CREATE', interaction => {
    const guild = client.guilds.cache.get(interaction.guild_id)
    const channel = guild.channels.cache.get(interaction.channel_id);
    const member = guild.members.cache.get(interaction.member.user.id)
    const command = client.commands.get(interaction.data.name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.data.name));
    try{
        command.execute(channel, interaction.data.options, member, interaction);
    } catch (error) {
        console.error(error);
    }
})

client.login(token).then();