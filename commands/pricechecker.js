const Discord = require("discord.js");
const {client} = require("../constants");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { pricechecker } = require('../config.json')

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

function edit (msg, args, page, member) {
    msg.edit(buildEmbed(args, page, member)).then()
}

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
        let page = reaction.message.embeds[0].fields[parseInt(reaction.message.embeds[0].fields.length)-2].value.split('/');
        if(!page){return;}
        let search = reaction.message.embeds[0].fields[reaction.message.embeds[0].fields.length-3].value;
        if(reaction.emoji.name === '➡') {
            await reaction.users.remove(user.id).then();
            if(page[0] !== page[1]) {
                edit(reaction.message, search, parseInt(page[0]))
            }
        }
        if(reaction.emoji.name === '⬅'){
            await reaction.users.remove(user.id).then();
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
        if (getResult["products"][page]["loose-price"]) {
            Embed.addField('Loose Price:', `$${getResult["products"][page]["loose-price"] / 100}`, true);
        }
        if (getResult["products"][page]["cib-price"]) {
            Embed.addField('CIB Price:', `$${getResult["products"][page]["cib-price"] / 100}`, true);
        }
        if (getResult["products"][page]["new-price"]) {
            Embed.addField('NEW Price:', `$${getResult["products"][page]["new-price"] / 100}`, true);
        }
        Embed.addField('Search Query', gameSearch, true);
        Embed.addField('Result', `${page + 1}/${Object.keys(getResult.products).length}`, true);
        Embed.addField('Get more info about this game', `https://www.pricecharting.com/game/${getResult["products"][page]["id"]}`);
        return Embed;
    }
}

function addNavigators(){
    let msg = client.user.lastMessage
    if(!msg.content.startsWith("Could not find any results for")){
        msg.react('⬅').then();
        msg.react('➡').then();
    }
}

module.exports = {
    name: 'pricecheck',
    aliases: ['pricecheck', 'price', 'pc'],
    description: 'GB,GBC & GBA Price Checker',
    options: [
        {
            "name": "game",
            "description": "GB, GBC or GBA game",
            "type": 3,
            "required": true
        }
    ],
    choices: [],
    execute: function (channel, args, member, interaction) {
        client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {embeds: [buildEmbed(args[0].value, 0)]}}})
        setTimeout(addNavigators, 2000)
    },
}