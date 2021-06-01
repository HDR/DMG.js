const {client} = require("./constants");
const Discord = require('discord.js')
const { token } = require('./config.json')
const fs = require('fs')
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const handlers = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
const eventLoggers = fs.readdirSync('./eventLoggers').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();

//Docs -
// Slash commands: https://deploy-preview-638--discordjs-guide.netlify.app/interactions/registering-slash-commands.html
// Buttons: https://deploy-preview-674--discordjs-guide.netlify.app/interactions/buttons.html
// v12 to V13: https://deploy-preview-551--discordjs-guide.netlify.app/additional-info/changes-in-v13.html#rolemanager

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
    const data = {
        name: command.name,
        description: command.description,
        options: command.options
    };

    registerCommands(data).then();

}

async function registerCommands(data){
    await client.application?.commands.create(data);
}

for (const file of handlers) {
    require(`./handlers/${file}`);
}

for (const file of eventLoggers) {
    require(`./eventLoggers/${file}`);
}

client.on('interaction', async interaction => {
    const guild = client.guilds.cache.get(interaction.guildID)
    const channel = guild.channels.cache.get(interaction.channelID);
    const member = guild.members.cache.get(interaction.user.id)
    const command = client.commands.get(interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.commandName));

    if (interaction.isMessageComponent() && interaction.componentType === 'BUTTON'){
        const buttonCommand = client.commands.get(interaction.message.interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.message.interaction.commandName));
        buttonCommand[interaction.customID.substr(7, interaction.customID.length-7)](interaction);
    } else {
        try{
            command.execute(channel, interaction.options, member, interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

client.login(token).then();