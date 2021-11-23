const {client} = require("../constants");
const sqlite3 = require('sqlite3');

function warn(user, reason, warned_by, silent){
    let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);}});
    db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS warnings (User text, WarningMessage text, WarnedBy text, Date text)`).run().finalize();});
    db.run('INSERT INTO "warnings"(User, WarningMessage, WarnedBy, Date) VALUES($User, $WarningMessage, $WarnedBy, $Date)', [user.id, reason, warned_by, Date.now()], function (err) {
        if (err) {
            return console.log(`Join ${err.message}`)
        } else {
            if(!silent) {
                user.send({content: `You have been Automatically warned by the Game Boy Discord Bot with the following warning \`${reason}\``});
            }
        }
    })
    db.close()
}

module.exports = {
    name: 'warn',
    description: 'Give a warning to a user',
    defaultPermission: false,
    options: [
        {
            "name": "user",
            "description": "User to warn",
            "type": 'USER',
            "required": true
        },
        {
            "name": "warning",
            "description": "Warning Message",
            "type": 'STRING',
            "required": true
        }
    ],
    execute: function (interaction) {
        warn(client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId).guild.members.cache.get(interaction.options.get('user').value).id, interaction.options.get('warning').value, client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id).user.id, false);
    },

    warn: function (member, reason, silent) {
        warn(member, reason, "419539233850785792", silent)
    }
}