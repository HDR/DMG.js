const {client} = require("../constants");
const { gallery } = require('./config/galleryHandler.json')
const { warn } = require("../commonFunctions")

client.on('messageCreate', async msg => {
    if (msg.channel === client.channels.cache.get(gallery)){
        let urlRE = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+",'i');
        let content = msg.content.split(' ');
        for (i = 0; i < content.length; i++){
            if(msg.attachments.size > 0){break;}
            if (!urlRE.test(content[i]) && !msg.author.bot){
                if(i === content.length - 1){
                    warn(msg.author, "[Automated Warning] Only images are allowed in gallery, please avoid chatting in this channel.", false)
                    await msg.delete();
                }
            } else { break; }
        }
    }
});