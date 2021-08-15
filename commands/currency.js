const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { currencyconverter } = require('../config.json')
const { MessageEmbed } = require("discord.js");

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
    description: 'Currency Converter',
    options: [
        {
            "name": "amount",
            "description": "Amount you want to convert",
            "type": 'INTEGER',
            "required": true
        },
        {
            "name": "base",
            "description": "3 Characters of base currency",
            "type": 'STRING',
            "required": true
        },
        {
            "name": "target",
            "description": "3 Characters of target currency",
            "type": 'STRING',
            "required": true
        }
    ],
    execute: async function (interaction) {
        if (!(interaction.options.get('base').value.toUpperCase() in getCurrencies())) {
            interaction.reply({ content: '⚠️ Please specify a valid base currency, you can find a list of valid Currencies at https://free.currconv.com/api/v7/currencies?apiKey=do-not-use-this-key', ephemeral: true})
            return
        }
        if (!(interaction.options.get('target').value.toUpperCase() in getCurrencies())) {
            interaction.reply({ content: '⚠️ Please specify a valid target currency, you can find a list of valid Currencies at https://free.currconv.com/api/v7/currencies?apiKey=do-not-use-this-key', ephemeral: true})
            return
        }
        let data = getData(interaction.options.get('base').value, interaction.options.get('target').value);
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            interaction.reply({ content: '⚠ Something went wrong attempting to fetch data, please try again.', ephemeral: true})
        } else {
            let amount = Object.values(getData(interaction.options.get('base').value, interaction.options.get('target').value))[0]
            let currencies = Object.keys(getData(interaction.options.get('base').value, interaction.options.get('target').value))[0].split('_')
            let conversion = interaction.options.get('amount').value * amount
            const Embed = new MessageEmbed();
            Embed.setColor('#2EB2C9');
            Embed.setTitle("Currency Conversion");
            Embed.addFields({ name: 'Base Currency', value: interaction.options.get('base').value.toUpperCase(), inline: true }, {name: 'Target Currency', value: interaction.options.get('target').value.toUpperCase(), inline: true }, {name: '‎', value: '‎', inline: true}, {name: 'Base Amount', value: `${interaction.options.get('amount').value} ${interaction.options.get('base').value.toUpperCase()}`, inline: true}, {name: 'Converted Amount', value: `${conversion.toFixed(2)} ${currencies[1]}`, inline: true}, {name: '‎', value: '‎', inline: true})
            interaction.reply({ embeds: [Embed]});
        }
    }
}