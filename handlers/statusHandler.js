const {client} = require("../constants");
const {Events} = require("discord.js");

client.on(Events.PresenceUpdate, async presence => {
    if(presence && presence.activities.length > 0) {
        presence.activities.forEach( activity => {
            if(typeof activity.type !== 'undefined' && activity.state !== null) {
                let copypasta = ['user is suspected to be a part of an online terrorist organization', 'user is a registered domestic terrorist']
                if(copypasta.some(string => activity.state.includes(string))){
                    presence.member.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: 'Automated Ban: Terrorist Copypasta' })
                    console.log(`${presence.user.tag} Banned for terrorist copypasta`)
                }
            }
        });
    }
});