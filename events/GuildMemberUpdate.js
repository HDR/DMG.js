const {client} = require("../constants");
const {Events} = require("discord.js");
const moment = require("moment");

client.on(Events.GuildMemberUpdate, async(OldGuildMember, NewGuildMember) => {
    if(OldGuildMember.pending && !NewGuildMember.pending) {
        let clear_time = moment.duration(moment().diff(NewGuildMember.joinedAt)).asSeconds();
        if(clear_time < 15) {
            try {
                await NewGuildMember.send({content: `[${OldGuildMember.guild.name}] You have been automatically kicked, Please make sure you've read the rules properly.`})
            } catch(e) {
                console.log(e)
            }
            await NewGuildMember.kick('Cleared rules too fast')
        }
    }

})