const { SlashCommandBuilder, MessageFlags} = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { key } = require('./config/pricechecker.json')
const sqlite3 = require("sqlite3");
const axios = require("axios");
const cheerio = require('cheerio');

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
        });
    })
}

async function getBoxart(url) {
    try {
        const response = await axios.get(url, {headers: {'Accept': '*/*'}})
        const $ = cheerio.load(response.data)
        const imageUrl = $('div.cover img').attr('src')
        if (imageUrl) {
            return imageUrl
        } else {
            return `https://martinrefseth.com/gameboy/assets/discord/NoImage_512x512.png`
        }
    } catch (e) {console.log(e)}
}

async function buildContainer(gameSearch, page, prevDisabled, nextDisabled) {
    const getResult = await getData(gameSearch)
    if(getResult === "error") {
        return null;
    } else {
        let consoleString = getResult["products"][page]["console-name"].replace('GameBoy', 'Game Boy')
        let consoleStringParts = consoleString.split(' ')
        let gConsole = consoleString
        let region = 'NA'

        if(["PAL", "JP"].includes(consoleStringParts[0])) {
            region = consoleStringParts[0]
            gConsole = consoleStringParts.slice(1).join(' ')
        }

        if(Object.keys(getResult.products).length === 1) {
            nextDisabled = true;
        }

        return {
            "type": 17,
            "accent_color": 1752220,
            "components": [
                {
                    "type": 9,
                    "accessory": {
                        "type": 11,
                        "media": {
                            "url": `${await getBoxart(`https://www.pricecharting.com/game/${getResult["products"][page]["id"]}`)}`
                        },
                        "description": `${gameSearch}`
                    },
                    "components": [
                        {
                            "type": 10,
                            "content": `## ${getResult["products"][page]["product-name"]}`
                        },
                        {
                            "type": 10,
                            "content": `**Console:** ${gConsole}\n**Region:** ${region}`,
                        },
                        {
                            "type": 10,
                            "content": `-# Result ${page + 1} of ${Object.keys(getResult.products).length}`
                        }
                    ]
                },
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "style": 3,
                            "label": `Loose Price: ${isNaN(getResult["products"][page]["loose-price"]) ? "N/A" : "$" + (getResult["products"][page]["loose-price"] / 100).toFixed(2)}`,
                            "custom_id": "priceOne"
                        },
                        {
                            "type": 2,
                            "style": 2,
                            "label": `CIB Price: ${isNaN(getResult["products"][page]["cib-price"]) ? "N/A" : "$" + (getResult["products"][page]["cib-price"] / 100).toFixed(2)}`,
                            "custom_id": "priceTwo"
                        },
                        {
                            "type": 2,
                            "style": 4,
                            "label": `NEW Price: ${isNaN(getResult["products"][page]["new-price"]) ? "N/A" : "$" + (getResult["products"][page]["new-price"] / 100).toFixed(2)}`,
                            "custom_id": "priceThree"
                        }
                    ]
                },
                {
                    "type": 14,
                    "divider": true,
                    "spacing": 1
                },
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "style": 1,
                            "label": "Previous",
                            "disabled": prevDisabled,
                            "custom_id": "previous"
                        },
                        {
                            "type": 2,
                            "style": 1,
                            "label": "Next",
                            "disabled": nextDisabled,
                            "custom_id": "next"
                        },
                        {
                            "type": 2,
                            "style": 5,
                            "label": "More Info",
                            "url": `https://www.pricecharting.com/game/${getResult["products"][page]["id"]}`
                        }
                    ]
                }
            ]
        };
    }
}

async function handlePriceClick(interaction) {
    await interaction.deferUpdate()
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
        await interaction.deferReply()
        let priceContainer = await buildContainer(interaction.options.getString('game'), 0, true, false)
        if(!priceContainer) {
            await interaction.editReply({ content: `Could not find any results for ${interaction.options.getString('game')}`}).then()
        } else {
            await interaction.editReply({ components: [priceContainer], flags: MessageFlags.IsComponentsV2}).then()
        }
    },

    previous: async function (interaction) {
        let page = await interaction.message.components[0].components[0].components[2].content.replace('-# Result ','').split(' of ')
        if(!page){return;}
        let search = interaction.message.components[0].components[0].accessory.description
        let priceContainer = await buildContainer(search, parseInt(page[0]-2), parseInt(page[0]) === 2, false)
        await interaction.deferUpdate().then();
        await interaction.editReply({ components: [priceContainer]}).then();
    },

    next: async function (interaction) {
        let page = await interaction.message.components[0].components[0].components[2].content.replace('-# Result ','').split(' of ')
        if(!page){return;}
        let search = interaction.message.components[0].components[0].accessory.description
        let priceContainer = await buildContainer(search, parseInt(page[0]), false, parseInt(page[0]) === parseInt(page[1]) - 1)
        await interaction.deferUpdate()
        await interaction.editReply({ components: [priceContainer]}).then();
    },

    priceOne: handlePriceClick,
    priceTwo: handlePriceClick,
    priceThree: handlePriceClick
}