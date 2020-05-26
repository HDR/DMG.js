const Discord = require("discord.js");

module.exports = {
    name: 'pc',
    aliases: ['pricecheck', 'price'],
    description: 'Price Checker',
    execute(msg, args) {
        if (!args.length) {
            msg.channel.send('Please specify a game')
        } else {
            let gameSearch = args.join(' ')
            const Embed = new Discord.MessageEmbed()
                .setColor('#1ABC9C')
                .setTitle('Title')
                .addFields(
                    { name: 'Console', value: 'PlaceHolder', inline: false},
                    { name: 'Loose Price:', value: 'PlaceHolder', inline: true },
                    { name: 'CIB Price:', value: 'PlaceHolder', inline: true },
                    { name: 'NIB Price:', value: 'PlaceHolder', inline: true },
                    { name : 'Search Query', value: gameSearch, inline: true },
                    { name : 'Result', value: "1/1", inline: true },
                    { name: 'Get more info about this game', value: 'PlaceHolder', inline: false},
                )
            msg.channel.send(Embed).then(msg => {
                msg.react('⬅')
                msg.react('➡')
            });


        }
    }
}