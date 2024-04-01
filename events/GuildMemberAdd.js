const {client} = require("../constants");

client.on('guildMemberAdd', async (member ) => {

    //Handle unreadable names
    let normalize = member.user.username.normalize("NFKC")
    if(normalize !== member.user.username) {
        await member.setNickname(normalize)
    }

    //Auto kick users that are too new
    let currentDate = new Date();
    if(Math.trunc(Math.ceil(currentDate.getTime() - member.user.createdAt.getTime()) / (1000 * 3600 * 24)) < 7 && !member.user.bot) {
        member.kick('Account is too new (less than 7 days old)')
    }
});