const constants = require('../constants')
constants.client.on('message', msg => {
    let imgur = ["IMGUR.COM/A/", "IMGUR.COM/GALLERY/"];
    if(imgur.some(v => msg.content.toUpperCase().includes(v))) {
        msg.channel.send(`The message posted by <@!${msg.author.id}> contains an imgur album link, it may have more than one image`)
    }
});