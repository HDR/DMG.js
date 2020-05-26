const Discord = require("discord.js");
const { prefix, token } = require('./config.json')
const fs = require('fs')

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

client.on('ready', () => {
    console.log("DMG.js Online")
    client.user.setActivity('Online!')
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error)
        msg.reply(`Something went wrong attempting to execute command`);
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.log("Failed to fetch reaction")
            return;
        }
    }

    if(reaction.message.author.id !== user.id && reaction.message.author.id === client.user.id){
        if(reaction.emoji.name === '➡' || reaction.emoji.name === '⬅')
                await reaction.users.remove(user.id);
    }
})

client.login(token);