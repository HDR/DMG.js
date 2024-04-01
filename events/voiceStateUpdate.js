const {client} = require("../constants");
const {Events} = require("discord.js");
const { voice_role } = require("./config/events.json")


client.on(Events.VoiceStateUpdate, async(oldState, newState) => {
    //Automatically assign the voice role to people in a voice channel
    if(newState.channelId !== null && !newState.member.user.bot) {
        newState.member.roles.add(newState.guild.roles.cache.find(role => role.id === voice_role)).then();
    }

    if(newState.channelId == null && !newState.member.user.bot) {
        if (oldState.member.roles.cache.has(voice_role)){
            oldState.member.roles.remove(oldState.guild.roles.cache.find(role => role.id === voice_role)).then();
        }
    }

})