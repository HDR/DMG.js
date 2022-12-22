const {client} = require("../constants");
const { voice_role } = require("./config/voiceHandler.json")
const { Events } = require("discord.js")

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    if (oldState.member.user.bot) return;

    if(newState.channelId !== null) {
        console.log("User Joined Voice")
        newState.member.roles.add(newState.guild.roles.cache.find(role => role.id === voice_role)).then();
    }

    if(newState.channelId == null) {
        console.log("User Left Voice")
        if (oldState.member.roles.cache.has("voice_role")){
            oldState.member.roles.remove(oldState.guild.roles.cache.find(role => role.id === voice_role)).then();
        }
    }
});