const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
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

function buildEmbed(gameSearch, page) {
    let getResult = getData(gameSearch)
    if(getResult ===  "error"){
        return `Could not find any results for ${gameSearch}`
    } else {
        const Embed = new MessageEmbed();
        Embed.setColor('#1ABC9C');
        Embed.setTitle(getResult["products"][page]["product-name"]);
        Embed.addField('Console', getResult["products"][page]["console-name"], false);
        if (getResult["products"][page]["loose-price"]) {Embed.addField('Loose Price:', `$${getResult["products"][page]["loose-price"] / 100}`, true);}
        if (getResult["products"][page]["cib-price"]) {Embed.addField('CIB Price:', `$${getResult["products"][page]["cib-price"] / 100}`, true);}
        if (getResult["products"][page]["new-price"]) {Embed.addField('NEW Price:', `$${getResult["products"][page]["new-price"] / 100}`, true);}
        Embed.addFields({name: 'Search Query', value: gameSearch, inline: true}, {name: 'Result', value: `${page + 1}/${Object.keys(getResult.products).length}`, inline: true}, {name: 'Get more info about this game', value: `https://www.pricecharting.com/game/${getResult["products"][page]["id"]}`})
        return Embed;
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
            "type": 'STRING',
            "required": true
        }
    ],
    execute: function (interaction) {

        const navigators = new MessageActionRow();
        navigators.addComponents(new MessageButton().setCustomID('button_previous').setLabel('Previous').setStyle('SECONDARY').setEmoji('⬅').setDisabled(true));
        navigators.addComponents(new MessageButton().setCustomID('button_next').setLabel('Next').setStyle('SECONDARY').setEmoji('➡'));
        interaction.reply({ embeds: [buildEmbed(interaction.options.get('game').value, 0)], components: [navigators]}).then()
    },

    previous: function (interaction) {
        let page = interaction.message.embeds[0].fields[parseInt(interaction.message.embeds[0].fields.length)-2].value.split('/');
        if(!page){return;}
        let search = interaction.message.embeds[0].fields[interaction.message.embeds[0].fields.length-3].value;
        const navigators = new MessageActionRow();

        if(parseInt(page[0]) !== 2){
            navigators.addComponents(new MessageButton().setCustomID('button_previous').setLabel('Previous').setStyle('SECONDARY').setEmoji('⬅').setDisabled(false));
        } else {
            navigators.addComponents(new MessageButton().setCustomID('button_previous').setLabel('Previous').setStyle('SECONDARY').setEmoji('⬅').setDisabled(true));
        }

        navigators.addComponents(new MessageButton().setCustomID('button_next').setLabel('Next').setStyle('SECONDARY').setEmoji('➡'));

        interaction.deferUpdate().then();
        interaction.editReply({ embeds: [buildEmbed(search, parseInt(page[0])-2)], components: [navigators]}).then();
    },

    next: function (interaction) {
        let page = interaction.message.embeds[0].fields[parseInt(interaction.message.embeds[0].fields.length)-2].value.split('/');
        if(!page){return;}
        let search = interaction.message.embeds[0].fields[interaction.message.embeds[0].fields.length-3].value;
        const navigators = new MessageActionRow();
        navigators.addComponents(new MessageButton().setCustomID('button_previous').setLabel('Previous').setStyle('SECONDARY').setEmoji('⬅').setDisabled(false));

        if(parseInt(page[0]) === parseInt(page[1]-1)) {
            navigators.addComponents(new MessageButton().setCustomID('button_next').setLabel('Next').setStyle('SECONDARY').setEmoji('➡').setDisabled(true));
        } else {
            navigators.addComponents(new MessageButton().setCustomID('button_next').setLabel('Next').setStyle('SECONDARY').setEmoji('➡').setDisabled(false));
        }
        interaction.deferUpdate().then();
        interaction.editReply({ embeds: [buildEmbed(search, parseInt(page[0]))], components: [navigators]}).then();
    }
}