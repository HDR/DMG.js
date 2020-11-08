const constants = require('./constants')
const Discord = require('discord.js')
const { prefix, token } = require('./config.json')
const fs = require('fs')

const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
constants.client.commands = new Discord.Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);
    constants.client.commands.set(command.name, command)
}

constants.client.on('ready', () => {
    console.log("DMG.js Online")
    constants.client.user.setActivity('Online!')
});

constants.client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = constants.client.commands.get(commandName) || constants.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error)
        msg.reply(`Something went wrong attempting to execute command`);
    }
});

constants.client.login(token);
