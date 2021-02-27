const constants = require('./constants')
const Discord = require('discord.js')
const { token } = require('./config.json')
const fs = require('fs')

const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const handlers = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
constants.client.commands = new Discord.Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);
    constants.client.commands.set(command.name, command)
    constants.client.api.applications('419539233850785792').commands.post({data: {
            name: command.name,
            description: command.description,
            options: command.options,
            choices: command.choices
       }}).then()
}

for (const file of handlers) {
    const handler = require(`./handlers/${file}`);
    constants.client.commands.set(handler.name, handler)
}

constants.client.ws.on('INTERACTION_CREATE', interaction => {
    const guild = constants.client.guilds.cache.get(interaction.guild_id)
    const channel = guild.channels.cache.get(interaction.channel_id);
    const member = guild.members.cache.get(interaction.member.user.id)
    const command = constants.client.commands.get(interaction.data.name) || constants.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.data.name));
    try{
        command.execute(channel, interaction.data.options, member);
    } catch (error) {
        console.error(error);
    }
})

constants.client.login(token).then();