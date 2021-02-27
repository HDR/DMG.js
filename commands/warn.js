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
    execute: function (msg, args) {
        let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);} console.log("Loaded Warning Database")});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS warnings (User text, WarningMessage text, WarnedBy text, Date text)`).run().finalize();});
        if (msg.member.roles.cache.find(r => r.name === "Yokoi Watch" || r.name === "MGB")) {
            let member = msg.guild.members.cache.get(args[0].replace(/\D+/g, ''))
            args.shift();
            let argstr = args.join(' ')
            if (member) {
                db.run('INSERT INTO "warnings"(User, WarningMessage, WarnedBy, Date) VALUES($User, $WarningMessage, $WarnedBy, $Date)', [member.id, argstr, msg.author.id, Date.now()], function (err) {
                    if (err) {
                        return console.log("Join " + err.message)
                    } else {
                        msg.channel.send("<@!" + member.id +  "> You have been warned by <@!" + msg.author.id + "> With the following warning `" + argstr + "`")
                    }
                })
            }  else {
                msg.channel.send("Could not find that user in this guild")
            }
        }
        db.close()
    }
}