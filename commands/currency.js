const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { currencyconverter } = require('../config.json')
const Discord = require("discord.js");
const {client} = require("../constants");

function getData(from, to) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://free.currconv.com/api/v7/convert?q=${from}_${to}&compact=ultra&apiKey=${currencyconverter}`, false)
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

function getCurrencies() {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://free.currconv.com/api/v7/currencies?apiKey=${currencyconverter}`, false)
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText)["results"];
}

module.exports = {
    name: 'convert',
    aliases: ['cc', 'convert', 'currency'],
    description: 'Currency Converter',
    options: [
        {
            "name": "Amount",
            "description": "Amount you want to convert",
            "type": 4,
            "required": true
        },
        {
            "name": "Base",
            "description": "3 Characters of base currency",
            "type": 3,
            "required": true
        },
        {
            "name": "Target",
            "description": "3 Characters of target currency",
            "type": 3,
            "required": true
        }
    ],
    choices: [],
    execute: function (channel, args, member, interaction) {
        if (!(args[1].value.toUpperCase() in getCurrencies())) {
            channel.send("⚠️ Please specify a valid base currency, you can find a list of valid Currencies at https://free.currconv.com/api/v7/currencies?apiKey=do-not-use-this-key")
            return
        }
        if (!(args[2].value.toUpperCase() in getCurrencies())) {
            channel.send("⚠️ Please specify a valid target currency, you can find a list of valid Currencies at https://free.currconv.com/api/v7/currencies?apiKey=do-not-use-this-key")
            return
        }
        let data = getData(args[1].value, args[2].value);
        if(Object.keys(data).length === 0 && data.constructor === Object){
            channel.send('⚠ Something went wrong attempting to fetch data, please try again.')
        } else {
            let amount = Object.values(getData(args[1].value, args[2].value))[0]
            let currencies = Object.keys(getData(args[1].value, args[2].value))[0].split('_')
            const Embed = new Discord.MessageEmbed();
            let conversion = args[0].value * amount
            Embed.setColor('#2EB2C9');
            Embed.setTitle("Currency Conversion");
            Embed.addField("Base Currency", args[1].value.toUpperCase(), true)
            Embed.addField("Target Currency", args[2].value.toUpperCase(), true)
            Embed.addField("‎", "‎", true)
            Embed.addField("Base Amount", `${args[0].value} ${args[1].value.toUpperCase()}`,true)
            Embed.addField("Converted Amount", `${conversion.toFixed(2)} ${currencies[1]}`, true)
            Embed.addField("‎", "‎", true)
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {embeds: [Embed]}}})
        }
    }
}