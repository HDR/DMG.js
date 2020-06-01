const Discord = require("discord.js");
const constants = require('../constants')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { pricechecker } = require('../config.json')
const client = require('../index')

function getData(search) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://www.pricecharting.com/api/products?t=${pricechecker}&q=${search}`, false)
    xmlHttp.send(null);
    let result = JSON.parse(xmlHttp.responseText)
    if(result["products"].length === 0) {
        return "error";
    } else {
        return result;
    }
}

function edit (msg, args, page) {
    msg.edit(buildEmbed(args, page))
}

constants.client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.log("Failed to fetch reaction")
            return;
        }
    }

    if(reaction.message.author.id !== user.id && reaction.message.author.id === constants.client.user.id){
        let page = reaction.message.embeds[0].fields[parseInt(reaction.message.embeds[0].fields.length)-2].value.split('/');
        let search = reaction.message.embeds[0].fields[reaction.message.embeds[0].fields.length-3].value;
        if(reaction.emoji.name === '➡') {
            await reaction.users.remove(user.id);
            if(page[0] !== page[1]) {
                edit(reaction.message, search, parseInt(page[0]))
            }
        }
        if(reaction.emoji.name === '⬅'){
            await reaction.users.remove(user.id);
            if(parseInt(page[0]) !== 1){
                edit(reaction.message, search, parseInt(page[0])-2)
            }

        }
    }
})

function buildEmbed(gameSearch, page) {
    let getResult = getData(gameSearch)
    if(getResult ===  "error"){
        return `Could not find any results for ${gameSearch}`
    } else {
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#1ABC9C');
        Embed.setTitle(getResult["products"][page]["product-name"]);
        Embed.addField('Console', getResult["products"][page]["console-name"], false);
        if (getResult["products"][page]["loose-price"] / 100 !== 0.0) {
            Embed.addField('Loose Price:', `$${getResult["products"][page]["loose-price"] / 100}`, true);
        }
        if (getResult["products"][page]["cib-price"] / 100 !== 0.0) {
            Embed.addField('CIB Price:', `$${getResult["products"][page]["cib-price"] / 100}`, true);
        }
        if (getResult["products"][page]["new-price"] / 100 !== 0.0) {
            Embed.addField('NEW Price:', `$${getResult["products"][page]["new-price"] / 100}`, true);
        }
        Embed.addField('Search Query', gameSearch, true);
        Embed.addField('Result', `${page + 1}/${Object.keys(getResult.products).length}`, true);
        Embed.addField('Get more info about this game', `https://www.pricecharting.com/game/${getResult["products"][page]["id"]}`);
        return Embed;
    }
}

module.exports = {
    name: 'pricecheck',
    aliases: ['pricecheck', 'price', 'pc'],
    description: 'Price Checker',
    execute: function (msg, args) {
        if (!args.length) { msg.channel.send('Please specify a game')
        } else {
            let gameSearch = args.join(' ')
            msg.channel.send(buildEmbed(gameSearch, 0)).then(msg => {
                if (buildEmbed(gameSearch, 0) !== `Could not find any results for ${gameSearch}`) {
                    msg.react('⬅');
                    msg.react('➡');
                }
            });

        }
    },
}