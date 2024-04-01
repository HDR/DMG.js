const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const {log_channel} = require("./config/events.json");
const moment = require("moment");

client.on(Events.GuildMemberUpdate, async(OldGuildMember, NewGuildMember) => {
    if(OldGuildMember.pending && !NewGuildMember.pending) {
        let clear_time = moment.duration(moment(moment().now).diff(NewGuildMember.joinedAt))
        if(clear_time.seconds() < 15) {
            try {
                await NewGuildMember.send({content: `[${OldGuildMember.guild.name}] You have been automatically kicked, Please make sure you've read the rules properly.`})
            } catch(e) {
                console.log(e)
            }
            await NewGuildMember.kick('Cleared rules too fast')
        }
    }

})