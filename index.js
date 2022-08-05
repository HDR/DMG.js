const {client} = require("./constants");
const Discord = require('discord.js')
const { token } = require('./config.json')
const permissions = require('./permissions.json')
const fs = require('fs')
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const handlers = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
const eventLoggers = fs.readdirSync('./eventLoggers').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

async function registerCommands(){
    const data = []
    for (const file of commands) {
        if (!client.application?.owner) await client.application?.fetch();
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command)
        console.log(file)
        data.push({
            name: command.name,
            type: command.type,
            defaultPermission: command.defaultPermission,
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

client.on('interactionCreate', async interaction => {

    if (interaction.isMessageComponent()) {
        if (interaction.isMessageComponent() && interaction.componentType === 'BUTTON') {
            const buttonCommand = client.commands.get(interaction.message.interaction.commandName);
            buttonCommand[interaction.customId](interaction);
        }

        if (interaction.isMessageComponent() && interaction.componentType === 'SELECT_MENU') {
            const menuCommand = client.commands.get(interaction.message.interaction.commandName);
            menuCommand[interaction.values[0]](interaction);
        }
    }

    if (interaction.type === 'MODAL_SUBMIT'){
        let commandSplit = interaction.customId.split('.')
        const modalCommand = client.commands.get(commandSplit[0]);
        modalCommand[commandSplit[1]](interaction);
    }

    if (interaction.isCommand()) {
        try{
            const command = client.commands.get(interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.commandName));
            command.execute(interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

client.login(token).then(registerCommands).then();