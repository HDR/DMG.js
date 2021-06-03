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
}

async function registerCommands(){
    const data = []
    for (const file of commands) {
        if (!client.application?.owner) await client.application?.fetch();
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command)
        data.push({
            name: command.name,
            description: command.description,
            options: command.options
        },);

    }
    await client.application?.commands.set(data).then();
}

for (const file of handlers) {
    require(`./handlers/${file}`);
}

for (const file of eventLoggers) {
    require(`./eventLoggers/${file}`);
}

client.on('interaction', async interaction => {
    if (interaction.isMessageComponent() && interaction.componentType === 'BUTTON'){
        const buttonCommand = client.commands.get(interaction.message.interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.message.interaction.commandName));
        buttonCommand[interaction.customID.substr(7, interaction.customID.length-7)](interaction);
    } else {
        try{
            const command = client.commands.get(interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.commandName));
            command.execute(interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

client.login(token).then(registerCommands).then();