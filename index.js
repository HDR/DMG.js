const constants = require('./constants')
const Discord = require('discord.js')
const { prefixes, token } = require('./config.json')
const fs = require('fs')

const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
constants.client.commands = new Discord.Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);
    constants.client.commands.set(command.name, command)
}

constants.client.on('message', msg => {
    for (const px of prefixes) {
        if(msg.content.trim().startsWith(px)){
            const args = msg.content.slice(px.length).split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = constants.client.commands.get(commandName) || constants.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) return;

            try {
                command.execute(msg, args);
            } catch (error) {
                console.error(error)
                msg.reply(`Something went wrong attempting to execute command`);
            }
        }
    }
});

constants.client.login(token);
