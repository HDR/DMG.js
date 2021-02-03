const constants = require('../constants')
const { marketChannel } = require('../config.json')

constants.client.on('message', async msg => {
    if (msg.channel === constants.client.channels.cache.get(marketChannel)){
        var emojis = [':BUYING:', ':SELLING:', ':WTB:', ':WTS:', ':TRADING:', ':WTT:'];
        let timeSinceJoin = new Date(Math.abs(msg.member.joinedAt - Date.now()));
        let timeSinceCreated = new Date(Math.abs(msg.author.createdAt - Date.now()));
        if (timeSinceJoin/1000/60/60/24 < 30 || timeSinceCreated/1000/60/60/24 < 90) {
            await msg.delete()
            await msg.author.send("Your post in the marketplace was deleted, Your account is either too new, or you have joined this server recently, please try again in a bit")
        } else {
            if (emojis.some(v => msg.content.toUpperCase().includes(v))) {

                msg.pin().catch(error => {
                    if (error.message.toString().includes("Maximum number of pins reached")) {
                        msg.channel.send("This channel has reached the max amount of pinned messages, performing some cleanup.")
                        msg.channel.messages.fetchPinned().then(messages => messages.each(message => {
                            if (Date.now() - message.createdAt > 1000 * 60 * 60 * 24 * 14) {
                                message.unpin();
                            }
                        }));
                        msg.author.send("https://tenor.com/view/hello-there-gif-9442662");
                        msg.author.send("Hello there, this is just a reminder that you should include the region/country in your listing and if you're selling something please include the price, this makes it easier for other users to navigate the marketplace");
                        msg.pin();

                    }
                })
            } else {
                if (!(msg.author.bot || msg.member.roles.cache.has('247002823089192971') || msg.member.roles.cache.has('573611775975620608'))) {
                    await msg.delete()
                    await msg.author.send("Your post in the marketplace has been deleted, please make use of the Buying, Selling or Trading emojis.")
                    await msg.author.send("Discussing purchases or asking questions should be done over Private Message.")
                }
            }
        }
    }
});