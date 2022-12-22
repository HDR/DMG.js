const {client} = require("./constants");
const { Collection, REST, Routes, Events } = require('discord.js');
const { token, guild } = require('./config.json')
const fs = require('fs')
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const handlers = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
const eventLoggers = fs.readdirSync('./eventLoggers').filter(file => file.endsWith('.js'));

client.commands = new Collection;

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command)
}

async function registerCommands(){
    const commandData = []
    for (const file of commands) {
        if (!client.application?.owner) await client.application?.fetch();
        const command = require(`./commands/${file}`);
        commandData.push(command.data.toJSON());

    }
    const rest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            console.log(`Started refreshing ${commandData.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationCommands(client.application.id),
                {body: commandData},
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })().then();
}

for (const file of handlers) {
    require(`./handlers/${file}`);
}

for (const file of eventLoggers) {
    require(`./eventLoggers/${file}`);
}

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    }

    if(interaction.isButton() || interaction.isModalSubmit()) {

        if(!interaction.message.interaction) {
            try {
                let modalString = interaction.customId.split('.')
                const command = interaction.client.commands.get(modalString[0]);
                if (!command) {
                    console.error(`No command matching ${modalString[0]} was found.`);
                    return;
                }

                try {
                    await command[modalString[1]](interaction);
                } catch (error) {
                    console.error(`Error executing ${interaction.customId}`);
                    console.error(error);
                }

            } catch (error) {
                console.error(`Error executing ${interaction.customId}`);
                console.error(error);
            }
        } else {
            const command = interaction.client.commands.get(interaction.message.interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.message.interaction.commandName} was found.`);
                return;
            }

            try {
                await command[interaction.customId](interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.message.interaction.commandName}`);
                console.error(error);
            }
        }
    }


});

client.login(token).then(registerCommands).then();