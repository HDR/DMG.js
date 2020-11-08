const constants = require('../constants')
const discordTTS = require('discord-tts')

constants.client.on("message",msg=>{
    if(msg.channel.id === "508405806983806976"){
        const voiceChannel = msg.member.voice.channel;
        if(voiceChannel) {
            voiceChannel.join().then(connection => {
                const stream = discordTTS.getVoiceStream(msg.content.toLowerCase());
                const dispatcher = connection.play(stream);
                dispatcher.on("finish",()=>voiceChannel.leave())
            });
        }
    }
})