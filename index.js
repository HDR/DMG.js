const {client} = require("./constants");
const Discord = require('discord.js')
const { token } = require('./config.json')
const fs = require('fs')
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const handlers = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
const eventLoggers = fs.readdirSync('./eventLoggers').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
    const data = {
        name: command.name,
        type: command.type,
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
    await registerPermissions()
}

async function registerPermissions() {
    //This should be a separate json file, but for now it's part of the code.
    await client.guilds.cache.get('246604458744610816')?.commands.permissions.set({
        fullPermissions: [{
            id: "876458008824135680",
            permissions: [{
                id: "247002823089192971",
                type: "ROLE",
                permission: !0
            }, {
                id: "789292170141368341",
                type: "ROLE",
                permission: !0
            }]
        }, {
            id: "815166595424583700",
            permissions: [{
                id: "247002823089192971",
                type: "ROLE",
                permission: !0
            }]
        }, {
            id: "815166596192403497",
            permissions: [{
                id: "247002823089192971",
                type: "ROLE",
                permission: !0
            }]
        }, {
            id: "815166597060755486",
            permissions: [{
                id: "247002823089192971",
                type: "ROLE",
                permission: !0
            }, {
                id: "789292170141368341",
                type: "ROLE",
                permission: !0
            }]
        }, {
            id: "815166685174562847",
            permissions: [{
                id: "247002823089192971",
                type: "ROLE",
                permission: !0
            }, {
                id: "789292170141368341",
                type: "ROLE",
                permission: !0
            }]
        }, {
            id: "836266640693002270",
            permissions: [{
                id: "247002823089192971",
                type: "ROLE",
                permission: !0
            }]
        }, {
            id: "849568569179111461",
            permissions: [{
                id: "247002823089192971",
                type: "ROLE",
                permission: !0
            }]
        }, {
            id: "901264295285911604",
            permissions: [{
                id: "177012181416542209",
                type: "USER",
                permission: !0
            }]
        },{
            id: "905466732502720563",
            permissions: [{
                id: "247002823089192971",
                type: "ROLE",
                permission: !0
            }]
        }]
    })
}

for (const file of handlers) {
    require(`./handlers/${file}`);
}

for (const file of eventLoggers) {
    require(`./eventLoggers/${file}`);
}

client.on('interactionCreate', async interaction => {
    if (interaction.isMessageComponent()){
        if (interaction.isMessageComponent() && interaction.componentType === 'BUTTON'){
            const buttonCommand = client.commands.get(interaction.message.interaction.commandName);
            buttonCommand[interaction.customId](interaction);
        }

        if (interaction.isMessageComponent() && interaction.componentType === 'SELECT_MENU'){
            const menuCommand = client.commands.get(interaction.message.interaction.commandName);
            menuCommand[interaction.values[0]](interaction);
        }
    }
    else {
        try{
            const command = client.commands.get(interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.commandName));
            command.execute(interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

client.login(token).then(registerCommands).then();