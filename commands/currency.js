const { key } = require('./config/currency.json')
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const oxr = require('open-exchange-rates'), fx = require("money")

oxr.set({ app_id: key })
oxr.latest(function() {fx.rates = oxr.rates; fx.base = oxr.base;})

function getCurrencies() {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://openexchangerates.org/api/currencies.json`, false)
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convert')
        .setDescription('Currency Converter')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to convert')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('base')
                .setDescription('3 Characters of base currency')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('target')
                .setDescription('3 Characters of target currency')
                .setRequired(true)),

    execute: async function (interaction) {
        if (!(interaction.options.get('base').value.toUpperCase() in getCurrencies())) {
            interaction.reply({ content: '⚠️ Please specify a valid base currency, you can find a list of valid Currencies at https://openexchangerates.org/api/currencies.json', ephemeral: true})
            return
        }
        if (!(interaction.options.get('target').value.toUpperCase() in getCurrencies())) {
            interaction.reply({ content: '⚠️ Please specify a valid target currency, you can find a list of valid Currencies at https://openexchangerates.org/api/currencies.json', ephemeral: true})
            return
        }

        let conversion = fx(interaction.options.getInteger('amount')).from(interaction.options.getString('base').toUpperCase()).to(interaction.options.getString('target').toUpperCase())
        const Embed = new EmbedBuilder();
        Embed.setColor('#2EB2C9')
            .setTitle("Currency Conversion")
            .addFields({ name: 'Base Currency', value: interaction.options.getString('base').toUpperCase(), inline: true }, {name: 'Target Currency', value: interaction.options.getString('target').toUpperCase(), inline: true }, {name: '‎', value: '‎', inline: true}, {name: 'Base Amount', value: `${interaction.options.getInteger('amount')} ${interaction.options.getString('base').toUpperCase()}`, inline: true}, {name: 'Converted Amount', value: `${conversion.toFixed(2)} ${interaction.options.getString('target').toUpperCase()}`, inline: true}, {name: '‎', value: '‎', inline: true})
        interaction.reply({ embeds: [Embed]});
    }
}