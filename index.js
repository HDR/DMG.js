const constants = require('./constants')
const Discord = require('discord.js')
const { prefixes, token } = require('./config.json')
const fs = require('fs')

const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
constants.client.commands = new Discord.Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);
<<<<<<< Updated upstream
    constants.client.commands.set(command.name, command)
=======
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
>>>>>>> Stashed changes
}

constants.client.on('message', msg => {
    for (const px of prefixes) {
        if(msg.content.trim().startsWith(px)){
            const args = msg.content.slice(px.length).split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = constants.client.commands.get(commandName) || constants.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) return;

<<<<<<< Updated upstream
            try {
                command.execute(msg, args);
            } catch (error) {
                console.error(error)
                msg.reply(`Something went wrong attempting to execute command`);
            }
=======
client.ws.on('INTERACTION_CREATE', interaction => {
    const guild = client.guilds.cache.get(interaction.guild_id)
    const channel = guild.channels.cache.get(interaction.channel_id);
    const member = guild.members.cache.get(interaction.member.user.id)
    const command = client.commands.get(interaction.data.name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.data.name));

    if(interaction.data.custom_id){
        const buttonCommand = client.commands.get(interaction.message.interaction.name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.message.interaction.name));
        buttonCommand[interaction.data.custom_id.substr(7, interaction.data.custom_id.length-7)](interaction);

    } else {
        try{
            command.execute(channel, interaction.data.options, member, interaction);
        } catch (error) {
            console.error(error);
>>>>>>> Stashed changes
        }
    }
});

constants.client.login(token);
