const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { currencyconverter } = require('../config.json')

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
    execute: function (msg, args) {
        if (!args[0] || !args[1] ||  !args[2]) {
            msg.channel.send('Please specify the Amount, Base Currency & Target Currency')
        } else {
            if (!(args[1].toUpperCase() in getCurrencies())) {
                msg.channel.send("⚠️ Please specify a valid base currency, you can find a list of valid Currencies at https://free.currconv.com/api/v7/currencies?apiKey=do-not-use-this-key")
                return
            }
            if (!(args[2].toUpperCase() in getCurrencies())) {
                msg.channel.send("⚠️ Please specify a valid target currency, you can find a list of valid Currencies at https://free.currconv.com/api/v7/currencies?apiKey=do-not-use-this-key")
                return
            }
            let data = getData(args[1], args[2]);
            if(Object.keys(data).length === 0 && data.constructor === Object){
                msg.channel.send('⚠ Something went wrong attempting to fetch data, please try again.')
            } else {
                amount = Object.values(getData(args[1], args[2]))[0]
                currencies = Object.keys(getData(args[1], args[2]))[0].split('_')
                msg.channel.send(`💸 ${parseInt(args[0]).toFixed(1)} ${currencies[0]} -> ${args[0] * amount.toFixed(2)} ${currencies[1]} `)
            }
        }
    }
}