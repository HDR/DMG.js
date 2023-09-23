const {client} = require("../constants");
const {Events} = require("discord.js");
const {troubleshooting_channel} = require("./config/troubleshootingHandler.json");


client.on(Events.ThreadCreate, async thread => {
    if (thread.parentId === troubleshooting_channel) {
        setTimeout(function() {
            thread.send({content: "Please remember to provide as much information as possible including all troubleshooting steps you have already taken. If this is a hardware issue, please provide clear in-focus images of the issue, PCB (circuit board), installation, and any soldering you have done. Help us help you, posts with insufficient information will be deleted"})
        }, 10000)
    }
});