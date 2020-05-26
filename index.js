const Discord = require("discord.js");
const { prefix, token } = require('./config.json')
const fs = require('fs')

const client = new Discord.Client();
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

client.on('ready', () => {
    console.log("Bot Online")
    client.user.setActivity('Online!')
});

client.on('message', msg => {

    console.log(msg.content)

    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    console.log(command);
    console.log(commandName);

    if (!command) return;

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error)
        msg.reply(`Something went wrong attempting to execute command`);
    }

});


client.login(token);