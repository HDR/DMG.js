const { client } = require("../constants");
const { Events } = require("discord.js");
const { market_channel } = require("./config/marketplaceHandler.json")
const { sendPM } = require("../commonFunctions");

client.on(Events.MessageCreate, async msg => {
    if (msg.channel.isThread && msg.channel.parentId === market_channel) {
        let timeSinceJoin = new Date(Math.abs(msg.member.joinedAt - Date.now()));
        let timeSinceCreated = new Date(Math.abs(msg.author.createdAt - Date.now()));
        if (timeSinceJoin/1000/60/60/24 < 30 || timeSinceCreated/1000/60/60/24 < 90) {
            await msg.delete()
            await sendPM(msg.author, "Your message in the marketplace was deleted, Your account is either too new, or you have joined this server recently, please try again in a bit");
        }
    }
});

client.on(Events.ThreadCreate, async thread => {
    if (thread.parentId === market_channel) {
        let threadOwner = await thread.fetchOwner()
        let timeSinceJoin = new Date(Math.abs(threadOwner.guildMember.joinedAt - Date.now()));
        let timeSinceCreated = new Date(Math.abs(threadOwner.user.createdAt - Date.now()));
        if (timeSinceJoin/1000/60/60/24 < 30 || timeSinceCreated/1000/60/60/24 < 90) {
            await thread.delete()
            await sendPM(threadOwner.user, "Your post in the marketplace was deleted, Your account is either too new, or you have joined this server recently, please try again in a bit");
        } else {
            setTimeout(function() {
                thread.send({content: "Please remember to include your location and the price if applicable. All items being sold must have clear images and prices."})
            }, 10000)
        }
    }
});