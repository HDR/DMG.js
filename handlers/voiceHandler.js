const {client} = require("../constants");

client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.user.bot) return;

    if(newState.channelId !== null) {
        console.log("User Joined Voice")
        newState.member.roles.add(newState.guild.roles.cache.find(role => role.id === "835606866833965146")).then();
    }

    if(newState.channelId == null) {
        console.log("User Left Voice")
        if (oldState.member.roles.cache.has("835606866833965146")){
            oldState.member.roles.remove(oldState.guild.roles.cache.find(role => role.id === "835606866833965146")).then();
        }
    }
});