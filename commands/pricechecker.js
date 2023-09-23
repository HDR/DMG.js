const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { key } = require('./config/pricechecker.json')
const {client} = require("../constants");
const sqlite3 = require("sqlite3");

function getData(search) {
    let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);}});
    let data = [];
    return new Promise((resolve) => {
        db.serialize(() => {
            db.prepare(`CREATE TABLE IF NOT EXISTS pricecheck (Search text, Date text, Result text)`).run().finalize();
            db.all(`SELECT Search as Search, Date as resultDate, Result as Result FROM pricecheck ORDER BY Date DESC;`, (err, rows) => {
                if (err) {console.log(err)}
                rows.forEach((row) => {
                    data.push(row);
                })

                if (data[0] !== undefined && search === data[0].Search && (Math.abs(data[0].resultDate - Date.now()) / 36e5) < 12) {
                    resolve(JSON.parse(data[0].Result))
                } else {
                    const xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", `https://www.pricecharting.com/api/products?t=${key}&q=` + encodeURIComponent(`${search}`), false)
                    xmlHttp.send(null);
                    let result = JSON.parse(xmlHttp.responseText)
                    if(result["products"].length === 0) {
                        db.close()
                        resolve("error");
                    } else {
                        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS pricecheck (Search text, Date text, Result text)`).run().finalize();});
                        db.run('INSERT INTO "pricecheck"(Search, Date, Result) VALUES($Search, $Date, $Result)', [search, Date.now(), JSON.stringify(result)], function (err) {
                            if (err) {
                                console.log('Something went wrong')
                                return console.log(`Join ${err.message}`)
                            }
                        })
                        db.close()
                        resolve(result);
                    }
                }
            });
        });    })
}

async function buildEmbed(gameSearch, page) {
    const getResult = await getData(gameSearch)
    if (getResult === "error") {
        return null;
    } else {
        const Embed = new EmbedBuilder();
        Embed.setColor('#1ABC9C');
        Embed.setTitle(getResult["products"][page]["product-name"]);
        Embed.addFields({name: `Console`, value: `${getResult["products"][page]["console-name"]}`, inline: false})
        if (getResult["products"][page]["loose-price"]) {Embed.addFields({name: `Loose Price:`, value: `$${getResult["products"][page]["loose-price"] / 100}`, inline: true})}
        if (getResult["products"][page]["cib-price"]) {Embed.addFields({name: `CIB Price:`, value: `$${getResult["products"][page]["cib-price"] / 100}`, inline: true})}
        if (getResult["products"][page]["new-price"]) {Embed.addFields({name: `NEW Price:`, value: `$${getResult["products"][page]["new-price"] / 100}`, inline: true})}
        Embed.addFields({name: 'Search Query', value: gameSearch, inline: true}, {name: 'Result', value: `${page + 1}/${Object.keys(getResult.products).length}`, inline: true}, {name: 'Get more info about this game', value: `https://www.pricecharting.com/game/${getResult["products"][page]["id"]}`})
        Embed.setURL(`https://www.pricecharting.com/game/${getResult["products"][page]["id"]}`)
        return Embed;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pricecheck')
        .setDescription('Check the price of GB,GBC & GBA Games')
        .addStringOption(option =>
        option.setName('game')
            .setDescription('GB, GBC or GBA Game')
            .setRequired(true)),

    execute: async function (interaction) {
        const navigators = new ActionRowBuilder()
        .addComponents(new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle('Secondary').setEmoji('⬅').setDisabled(true))
        .addComponents(new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle('Secondary').setEmoji('➡'))
        await interaction.deferReply()
        let embed = await buildEmbed(interaction.options.getString('game'), 0)
        if(!embed) {
            await interaction.editReply({ content: `Could not find any results for ${interaction.options.getString('game')}`}).then()
        } else {
            await interaction.editReply({ embeds: [embed], components: [navigators]}).then()
        }
    },

    previous: async function (interaction) {
        let page = interaction.message.embeds[0].fields[parseInt(interaction.message.embeds[0].fields.length)-2].value.split('/');
        if(!page){return;}
        let search = interaction.message.embeds[0].fields[interaction.message.embeds[0].fields.length-3].value;
        const navigators = new ActionRowBuilder();

        if(parseInt(page[0]) !== 2){
            navigators.addComponents(new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle('Secondary').setEmoji('⬅').setDisabled(false));
        } else {
            navigators.addComponents(new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle('Secondary').setEmoji('⬅').setDisabled(true));
        }

        navigators.addComponents(new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle('Secondary').setEmoji('➡'));
        await interaction.deferUpdate().then();
        await interaction.editReply({ embeds: [await buildEmbed(search, parseInt(page[0])-2)], components: [navigators]}).then();
    },

    next: async function (interaction) {
        let page = interaction.message.embeds[0].fields[parseInt(interaction.message.embeds[0].fields.length)-2].value.split('/');
        if(!page){return;}
        let search = interaction.message.embeds[0].fields[interaction.message.embeds[0].fields.length-3].value;
        const navigators = new ActionRowBuilder();
        navigators.addComponents(new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle('Secondary').setEmoji('⬅').setDisabled(false));

        if(parseInt(page[0]) === parseInt(page[1]-1)) {
            navigators.addComponents(new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle('Secondary').setEmoji('➡').setDisabled(true));
        } else {
            navigators.addComponents(new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle('Secondary').setEmoji('➡').setDisabled(false));
        }
        await interaction.deferUpdate()
        await interaction.editReply({ embeds: [await buildEmbed(search, parseInt(page[0]))], components: [navigators]}).then();
    }
}