const {client} = require("./constants");

module.exports = {

    // Private Message handling, if we can't pm the user, @ them in #off-topic with the message instead.
    DMGsendPM: function (user, message){
        user.send({content: `${message}`}).catch(error => {
            let guild = client.guilds.cache.get('246604458744610816');
            guild.channels.cache.get('711946605997195285').send({content: `<@${user.id}> ${message} (This message was posted in public chat as i could not pm you)`});
        });
    }

}