const sqlite3 = require('sqlite3');

module.exports = {
    name: 'warn',
    aliases: ['w', 'warning'],
    description: 'Give a warning to a user',
    options: [
        {
            "name": "User",
            "description": "User to warn",
            "type": 6,
            "required": true
        },
        {
            "name": "Warning",
            "description": "Warning Message",
            "type": 3,
            "required": true
        }
    ],
    choices: [],
    execute: function (channel, args, member) {
        let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);} console.log("Loaded Warning Database")});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS warnings (User text, WarningMessage text, WarnedBy text, Date text)`).run().finalize();});
        if (member.roles.cache.find(r => r.name === "Yokoi Watch" || r.name === "MGB")) {
            let user = channel.guild.members.cache.get(args[0].value)
            if (user) {
                db.run('INSERT INTO "warnings"(User, WarningMessage, WarnedBy, Date) VALUES($User, $WarningMessage, $WarnedBy, $Date)', [user.id, args[1].value, member.user.id, Date.now()], function (err) {
                    if (err) {
                        return console.log(`Join ${err.message}`)
                    } else {
                        channel.send(`<@!${user.id}> You have been warned by <@!${member.user.id}> With the following warning \`${args[1].value}\``)
                    }
                })
            }  else {
                channel.send(`<@!${channel.author.id}> Could not find that user in this guild`)
            }
        }
        db.close()
    }
}