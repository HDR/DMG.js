const Discord = require("discord.js");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { currencyconverter } = require('../config.json')

function getData(from, to) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://free.currencyconverterapi.com/api/v6/convert?q=${from}_${to}&compact=ultra&apiKey=${currencyconverter}`, false)
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

module.exports = {
    name: 'currency converter',
    aliases: ['cc', 'convert', 'currency'],
    description: 'Price Checker',
    execute: function (msg, args) {
        if (!args[0] || !args[1] ||  !args[2]) {
            msg.channel.send('Please specify the Amount, Base Currency & Target Currency')
        } else {
            amount = Object.values(getData(args[1], args[2]))[0]
            currencies = Object.keys(getData(args[1], args[2]))[0].split('_')
            msg.channel.send(`💸 ${parseInt(args[0]).toFixed(1)} ${currencies[0]} -> ${args[0]*amount.toFixed(2)} ${currencies[1]} `)
        }
    }
}