const { SlashCommandBuilder } = require('discord.js')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { cse_api_key, cse_cx } = require('./config/image.json')

function getData(search) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://www.googleapis.com/customsearch/v1?q=${search}&num=1&start=1&safe=active&searchType=image&key=${cse_api_key}&cx=${cse_cx}`, false)
    xmlHttp.send(null);
    let result = JSON.parse(xmlHttp.responseText)
    if (result["searchInformation"]["totalResults"] === '0'){
        return `Could not find any results for ${search}, please try again`;
    } else {
        return result["items"][0]["link"];
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Pull the first image search result from google')
        .addStringOption(option =>
        option.setName('search')
            .setDescription('search text')
            .setRequired(true)),

    execute: function (interaction) {
        interaction.reply(`${getData(interaction.options.getString('search'))}`);
    }
}