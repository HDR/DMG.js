const Discord = require("discord.js");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { pricechecker } = require('../config.json')

module.exports = {
    name: 'pc',
    aliases: ['pricecheck', 'price'],
    description: 'Price Checker',
    execute: function (msg, args, page) {
        if (!args.length) {
            msg.channel.send('Please specify a game')
        } else {
            let gameSearch = args.join(' ')

            if (!page){var page = 0}

            function getData(search, callback) {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", `https://www.pricecharting.com/api/products?t=${pricechecker}&q=${search}`, false)
                xmlHttp.send(null);
                return JSON.parse(xmlHttp.responseText);
            }

            let getResult = getData(gameSearch)

            const Embed = new Discord.MessageEmbed();
            Embed.setColor('#1ABC9C');
            Embed.setTitle(getResult["products"][page]["product-name"]);
            Embed.addField('Console', getResult["products"][page]["console-name"], false);
            if (getResult["products"][page]["loose-price"] / 100 !== 0.0) {Embed.addField('Loose Price:', `$${getResult["products"][0]["loose-price"] / 100}`, true);}
            if (getResult["products"][page]["cib-price"] / 100 !== 0.0) {Embed.addField('CIB Price:', `$${getResult["products"][0]["cib-price"] / 100}`, true);}
            if (getResult["products"][page]["new-price"] / 100 !== 0.0) {Embed.addField('NEW Price:', `$${getResult["products"][0]["new-price"] / 100}`, true);}
            Embed.addField('Search Query', gameSearch, true);
            Embed.addField('Result', `1/${Object.keys(getResult).length+1}`, true)
            Embed.addField('Get more info about this game', `https://www.pricecharting.com/game/${getResult["products"][0]["id"]}`)

            msg.channel.send(Embed).then(msg => {
                msg.react('⬅')
                msg.react('➡')
            });


        }
    }
}