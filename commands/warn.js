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
    execute: function (interaction) {
        const member = client.guilds.cache.get(interaction.guildID).members.cache.get(interaction.user.id)
        const channel = client.guilds.cache.get(interaction.guildID).channels.cache.get(interaction.channelID);
        let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);} console.log("Loaded Warning Database")});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS warnings (User text, WarningMessage text, WarnedBy text, Date text)`).run().finalize();});
        if (member.roles.cache.find(r => r.name === "Yokoi Watch" || r.name === "MGB")) {
            let user = channel.guild.members.cache.get(interaction.options.get('user').value)
            if (user) {
                db.run('INSERT INTO "warnings"(User, WarningMessage, WarnedBy, Date) VALUES($User, $WarningMessage, $WarnedBy, $Date)', [user.id, interaction.options.get('warning').value, member.user.id, Date.now()], function (err) {
                    if (err) {
                        return console.log(`Join ${err.message}`)
                    } else {
                        interaction.reply(`<@!${user.id}> Was successfully warned with the following warning \`${interaction.options.get('warning').value}\``, { ephemeral: true }).then(user.send(`You have been warned by the Game Boy Discord staff with the following warning \`${interaction.options.get('warning').value}\``));
                    }
                })
            }  else {
                interaction.reply('Could not find that user in this guild', { ephemeral: true });
            }
        }
        db.close()
    }
}