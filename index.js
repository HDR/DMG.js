const {client} = require("./constants");
const { Collection, Routes } = require('discord.js')
const { REST } = require('@discordjs/rest');
const { token, guild } = require('./config.json')
const fs = require('fs')

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const handlerFiles = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
const eventLoggerFiles = fs.readdirSync('./eventLoggers').filter(file => file.endsWith('.js'));

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}


for (const file of handlerFiles) {
    require(`./handlers/${file}`);
}

for (const file of eventLoggerFiles) {
    require(`./eventLoggers/${file}`);
}

async function registerCommands(){
    const data = []
    for (const file of commandFiles) {
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
    await client.guilds.cache.get(guild).commands.set(data).then();
}

client.on('interactionCreate', async interaction => {

    //console.log(interaction)

    //if (interaction.isMessageComponent()) {
    //    if (interaction.isMessageComponent() && interaction.componentType === 'BUTTON') {
    //        const buttonCommand = client.commands.get(interaction.message.interaction.commandName);
    //        buttonCommand[interaction.customId](interaction);
    //    }
//
    //    if (interaction.isMessageComponent() && interaction.componentType === 'SELECT_MENU') {
    //        const menuCommand = client.commands.get(interaction.message.interaction.commandName);
    //        menuCommand[interaction.values[0]](interaction);
    //    }
    //}
//
    //if (interaction.type === 'MODAL_SUBMIT'){
    //    let commandSplit = interaction.customId.split('.')
    //    const modalCommand = client.commands.get(commandSplit[0]);
    //    modalCommand[commandSplit[1]](interaction);
    //}
//
    if (interaction.isCommand()) {
        try{
            const command = client.commands.get(interaction.commandName) || client.commands.find(cmd => cmd.includes(interaction.commandName));
            command.execute(interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

client.login(token).then(registerCommands).then();