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
            Embed.addFields({name: 'Message', value: `Message is a slash command response (${msg.interaction.commandName})`})
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
                if(lastMessage.author.id === mentioned.id && dateDiff.getTime() / 1000 < 150){
                    warn.warn(msg.author, "[Automated Warning] Please avoid mentioning users that are currently active (Replied to the latest message in channel with the mention option enabled)", client.user.id, true)
                    sendPM(msg.author, "Please remember to switch this option from **on** to **off** if you're replying to an active user. https://i.imgur.com/oTorezr.png")
                }
            }
        });
    }

    //LinkSanitizer2
    const rgxURL = /(https?:\/\/[^\s]+)/g;
    const fHosts = ["aliexpress", "taobao", "ebay", "amazon"];
    const aParams = ["SearchText", "SortType", "page", "CatId", "id", "itm", "dp"];

    const FilterUrls = (link) => {
        const url = new URL(link);
        const isMatch = fHosts.some(host => url.hostname.includes(host));
        if (!isMatch) return false;
        const filteredParams = new URLSearchParams(url.search);
        url.searchParams.forEach((_, key) => {
            if (!aParams.includes(key)) {
                filteredParams.delete(key);
            }
        });
        let response = `${url.origin}${url.pathname}`;
        if (Array.from(filteredParams).length) {
            response += `?${filteredParams.toString()}`;
        }
        return response;
    }

    if(msg.content.match(rgxURL) && !msg.author.bot) {
        if(msg.content.match(rgxURL).toString() !== msg.content.match(rgxURL).map(link => FilterUrls(link)).toString() && FilterUrls(msg.content.match(rgxURL)) !== false){
            msg.reply({ content: `I've attempted to sanitize your url: ${msg.content.match(rgxURL).map(link => FilterUrls(link))}`, allowedMentions: { repliedUser: false }}).then()
        }
    }

    let analogueStrings = ['ANALOGUE POCKET', 'ANALOGUE.CO', 'ANALOG POCKET', 'ANALOGPOCKET', 'ANALOGUE', 'ANAL POCKET', 'ANALPOCKET'];
    if(msg.channelId === '246604458744610816' || msg.channelId === '744938437693407393' || msg.channelId === '332487777986019337' || msg.channelId === '332487991383687169' || msg.channelId === '717097354209001653'){
        if(!msg.author.bot && analogueStrings.some(string => msg.content.toUpperCase().includes(string))) {
            sendPM(msg.author, "It seems like you posted something related to the Analogue Pocket, please keep non-game boy content to #off-topic");
        }
    }

    //Temporary .webp restriction
    if(msg.attachments.size > 0) {
        msg.attachments.forEach(function(attachment) {
            if(attachment.contentType === 'image/webp') {
                sendPM(msg.author, 'Sorry .webp files are currently not allowed due to a security vulnerability (CVE-2023-4863)')
                msg.delete()
            }
        })
    }

    //Draw Kicad Boards
    if(msg.attachments.size > 0) {
        msg.attachments.forEach(function(attachment) {
            console.log(attachment)
            if(attachment.name.includes('.kicad_pcb')) {

            }
        })
    }
});