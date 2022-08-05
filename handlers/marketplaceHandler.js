const {client} = require("../constants");
const { marketChannel } = require('../config.json')
const {DMGsendPM} = require("../commonFunctions");

client.on('messageCreate', async msg => {
    if (msg.channel === client.channels.cache.get(marketChannel)){
        let emojis = [':BUYING:', ':SELLING:', ':WTB:', ':WTS:', ':TRADING:', ':WTT:'];
        let timeSinceJoin = new Date(Math.abs(msg.member.joinedAt - Date.now()));
        let timeSinceCreated = new Date(Math.abs(msg.author.createdAt - Date.now()));
        if (timeSinceJoin/1000/60/60/24 < 30 || timeSinceCreated/1000/60/60/24 < 90) {
            await msg.delete()
            await DMGsendPM(msg.author, "Your post in the marketplace was deleted, Your account is either too new, or you have joined this server recently, please try again in a bit");
        } else {
            if (emojis.some(v => msg.content.toUpperCase().includes(v))) {

                msg.channel.messages.fetchPinned().then(async messages => {

                    if(messages.findKey(u => u.author.id === msg.author.id)){
                        await DMGsendPM(msg.author, "Your post in marketplace was deleted, you already have a pinned listing, please delete or edit your old listing")
                        await msg.delete()
                    } else {
                        await msg.pin()
                        await DMGsendPM(msg.author, "https://tenor.com/view/hello-there-gif-9442662")
                        await DMGsendPM(msg.author, "Hello there, this is just a reminder that you should include the region/country in your listing and if you're selling something please include the price, this makes it easier for other users to navigate the marketplace")
                    }

                    messages.partition(async u => {
                        let timesinceCreated = new Date(Math.abs(u.createdTimestamp - Date.now())) / 1000 / 60 / 60 / 24
                        if (timesinceCreated > 30) {
                            await msg.channel.messages.fetch(u.id).then(pinned => pinned.unpin())
                        }
                    })
                })
            } else {
                if (!(msg.author.bot || msg.member.roles.cache.has('247002823089192971') || msg.member.roles.cache.has('573611775975620608') || msg.member.roles.cache.has('247002545417879553'))) {
                    await msg.delete()
                    await DMGsendPM(msg.author, "Your post in the marketplace has been deleted, please make use of the Buying, Selling or Trading emojis.")
                    await DMGsendPM(msg.author, "Discussing purchases or asking questions should be done over Private Message.")
                }
            }
        }
    }
});