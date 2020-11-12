const constants = require('../constants')
const { marketChannel } = require('../config.json')

constants.client.on('message', async msg => {
    if (msg.channel === constants.client.channels.cache.get(marketChannel)){
        var emojis = [':BUYING:', ':SELLING:', ':WTB:', ':WTS:', ':TRADING:', ':WTT:'];
        if(emojis.some(v => msg.content.toUpperCase().includes(v))){
            msg.pin().catch(error => {
                if (error.message.toString().contains("Maximum number of pins reached")){
                    msg.channel.send("This channel has reached the max amount of pinned messages, performing some cleanup.")
                    msg.channel.messages.fetchPinned().then(messages => messages.each(message => {if (Date.now() - message.createdAt > 1000*60*60*24*14) {message.unpin();}}));
                    msg.pin();

                }
            })
        }
        else {
            if (!(msg.author.bot || msg.member.roles.cache.has('247002823089192971'))){
                await msg.delete()
                await msg.author.send("Your post was deleted, please make use of the Buying, Selling or Trading emojis.")
                await msg.author.send("Discussing purchases or asking questions should be done over Private Message.")
            }
        }
    }
});