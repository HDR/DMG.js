const {client} = require("../constants");
const sqlite3 = require('sqlite3');

module.exports = {
    name: 'warn',
    aliases: ['w', 'warning'],
    description: 'Give a warning to a user',
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
    choices: [],
    execute: function (channel, args, member, interaction) {
        let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);} console.log("Loaded Warning Database")});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS warnings (User text, WarningMessage text, WarnedBy text, Date text)`).run().finalize();});
        if (member.roles.cache.find(r => r.name === "Yokoi Watch" || r.name === "MGB")) {
            let user = channel.guild.members.cache.get(args[0].value)
            if (user) {
                db.run('INSERT INTO "warnings"(User, WarningMessage, WarnedBy, Date) VALUES($User, $WarningMessage, $WarnedBy, $Date)', [user.id, args[1].value, member.user.id, Date.now()], function (err) {
                    if (err) {
                        return console.log(`Join ${err.message}`)
                    } else {
                        interaction.reply(`<@!${user.id}> Was successfully warned with the following warning \`${args[1].value}\``, { ephemeral: true }).then(user.send(`You have been warned by the Game Boy Discord staff with the following warning \`${args[1].value}\``));
                    }
                })
            }  else {
                interaction.reply('Could not find that user in this guild', { ephemeral: true });
            }
        }
        db.close()
    }
}