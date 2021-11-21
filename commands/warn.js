const {client} = require("../constants");
const sqlite3 = require('sqlite3');

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
        const member = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id)
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);} console.log("Loaded Warning Database")});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS warnings (User text, WarningMessage text, WarnedBy text, Date text)`).run().finalize();});
        if (member.roles.cache.find(r => r.name === "Yokoi Watch" || r.name === "MGB")) {
            let user = channel.guild.members.cache.get(interaction.options.get('user').value)
            if (user) {
                db.run('INSERT INTO "warnings"(User, WarningMessage, WarnedBy, Date) VALUES($User, $WarningMessage, $WarnedBy, $Date)', [user.id, interaction.options.get('warning').value, member.user.id, Date.now()], function (err) {
                    if (err) {
                        return console.log(`Join ${err.message}`)
                    } else {
                        interaction.reply({ content: `<@!${user.id}> Was successfully warned with the following warning \`${interaction.options.get('warning').value}\``,  ephemeral: true }).then(user.send({ content: `You have been warned by the Game Boy Discord staff with the following warning \`${interaction.options.get('warning').value}\``}));
                    }
                })
            }  else {
                interaction.reply({ content: 'Could not find that user in this guild', ephemeral: true });
            }
        }
        db.close()
    },

    warn: function (member, warning) {
        let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);} console.log("Loaded Warning Database")});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS warnings (User text, WarningMessage text, WarnedBy text, Date text)`).run().finalize();});
        db.run('INSERT INTO "warnings"(User, WarningMessage, WarnedBy, Date) VALUES($User, $WarningMessage, $WarnedBy, $Date)', [member.id, warning, "419539233850785792", Date.now()], function (err) {
            if (err) {
                return console.log(`Join ${err.message}`)
            } else {
                member.send({content: `You have been Automatically warned by the Game Boy Discord Bot with the following warning \`${warning}\``});
            }
        })
        db.close()
    }
}