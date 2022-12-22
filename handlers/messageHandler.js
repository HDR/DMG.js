const {client} = require("../constants");
const { EmbedBuilder, Events } = require("discord.js");
const url = require("url");
const querystring = require('querystring');
const warn = require("../commonFunctions");
const { sendPM } = require("../commonFunctions");
const { log_channel } = require("./config/messageHandler.json")

client.on(Events.MessageCreate, async msg => {
    //Handle DM notifications for logging purposes
    if (msg.guild === null) {
        let guild = client.guilds.cache.get('246604458744610816');
        const Embed = new EmbedBuilder();
        Embed.setColor('#0D22CC');
        if(msg.author.bot){
            Embed.setTitle('DMG Sent Message to User')
            if(msg.interaction) {
                Embed.addFields({name: 'User', value: `${msg.interaction.user.username}#${msg.interaction.user.discriminator}`})
            } else {
                Embed.addFields({name: 'User', value: `${msg.channel.recipient.tag}`})
            }
        } else {
            Embed.setTitle('User Sent Message to DMG')
            Embed.addFields({name: 'User', value: msg.author.username + "#" + msg.author.discriminator, inline: false})
        }
        if(msg.content.length > 0) {
            Embed.addFields({name: 'Message', value: `${msg.content}`})
        } else {
            Embed.addFields({name: 'Message', value: `Message is an embed (command reply)`})
        }
        await guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    }

    //Automatically warn users abusing the reply feature without unchecking the mention button.
    if(msg.mentions.users.first() !== undefined){
        let mentioned = msg.mentions.users.first();
        msg.channel.messages.fetch( {limit: 1, before: msg.id} ).then(messages => {
            if(!msg.author.bot && mentioned !== msg.author) {
                let lastMessage = messages.first();
                let dateDiff = new Date(Math.abs(lastMessage.createdAt - msg.createdAt));
                if(lastMessage.author.id === mentioned.id && dateDiff.getTime() / 1000 < 300){
                    warn.warn(msg.author, "[Automated Warning] Please avoid mentioning users that are currently active (Replied to the latest message in channel with the mention option enabled)", true)
                    sendPM(msg.author, "Please remember to switch this option from **on** to **off** if you're replying to an active user. https://i.imgur.com/oTorezr.png")
                }
            }
        });
    }

    //LinkSanitizer
    let urlRE = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+");
    if(msg.content.match(urlRE) && !msg.author.bot) {
        if(msg.content.match(urlRE)[0].includes("aliexpress") && !msg.content.match(urlRE)[0].includes("a.aliexpress")) {
            let AliID = url.parse(msg.content.match(urlRE)[0]).pathname
            let crURL = [`https://www.aliexpress.com${AliID}`, `https://aliexpress.com${AliID}`]
            if (crURL.indexOf(msg.content.match(urlRE)[0]) === -1) {
                msg.reply({ content: `I've attempted to sanitize your url: https://www.aliexpress.com${AliID}`, allowedMentions: { repliedUser: false }}).then()
            }
        }

        if(msg.content.match(urlRE)[0].includes("taobao")) {
            let TaoID = querystring.parse(url.parse(msg.content).query).id
            if(msg.content.match(urlRE)[0] !== `https://2.taobao.com/item.htm?id=${TaoID}`) {
                msg.reply({ content: `I've attempted to sanitize your url: https://2.taobao.com/item.htm?id=${TaoID}`, allowedMentions: { repliedUser: false }}).then()
            }
        }
    }

    let analogueStrings = ['ANALOGUE POCKET', 'ANALOGUE.CO', 'ANALOG POCKET', 'ANALOGPOCKET', 'ANALOGUE', 'ANAL POCKET', 'ANALPOCKET'];
    if(msg.channelId === '246604458744610816' || msg.channelId === '744938437693407393' || msg.channelId === '332487777986019337' || msg.channelId === '332487991383687169' || msg.channelId === '717097354209001653'){
        if(!msg.author.bot && analogueStrings.some(string => msg.content.toUpperCase().includes(string))) {
            sendPM(msg.author, "It seems like you posted something related to the Analogue Pocket, please keep non-game boy content to #off-topic");
        }
    }
});