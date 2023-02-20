const {client} = require("../constants");
const sqlite3 = require('sqlite3');
const {sendPM} = require("../commonFunctions");
const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");

function Strike(interaction) {
    let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);}});
    db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS mutes (User text, Reason text, MutedBy text, Strike integer, Date text)`).run().finalize();});
    const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
    let user = channel.guild.members.cache.get(interaction.options.get('user').value)
    db.serialize(() => {
        let data = [];
        let strikes = "";
        let date = "";
        db.all(`SELECT User as user, Reason as reason, MutedBy as mutedby, Strike as strike, Date as date FROM mutes ORDER BY date DESC;`, (err, rows) => {
            if (err) {console.log(err)}
            rows.forEach((row) => {
                if (row.user === user.id) {
                    data.push(row);
                }
            })
            if (data[0] !== undefined) {
                strikes = data[0].strike;
                date = data[0].date;
            } else {
                strikes = 0;
                date = new Date().getTime();
            }

            if (new Date().getTime() - new Date(date).getTime() >= 60 * 24 * 60 * 60 * 1000) {
                strikes = strikes - 1;
            }

            let reason = interaction.options.get('reason').value;

            switch (strikes) {
                case 0:
                    //Mute for 1 Hour
                    user.timeout(3600000, reason + ` - ${strikes + 1}/5 Strikes`).then(addStrike(interaction, 1, reason))
                    break;
                case 1:
                    //Mute for 24 Hours
                    user.timeout(24 * 60 * 60 * 1000, reason + ` - ${strikes + 1}/5 Strikes`).then(addStrike(interaction, 2, reason))
                    break;
                case 2:
                    //Mute for 1 Week
                    user.timeout(7 * 24 * 60 * 60 * 1000, reason + ` - ${strikes + 1}/5 Strikes`).then(addStrike(interaction, 3, reason))
                    break;
                case 3:
                    //Mute for 28 Days
                    user.timeout(28 * 24 * 60 * 60 * 1000 - 1000, reason + ` - ${strikes + 1}/5 Strikes`).then(addStrike(interaction, 4, reason))
                    break;
                case 4:
                    //Ban
                    sendPM(user, `You have been banned from the Game boy discord for reaching 5 strikes`)
                    user.ban({reason: "Automatic Ban, user reached 5/5 strikes"}).then()

            }

            interaction.reply({content: `Muted ${user.user.username}#${user.user.discriminator}, this user now has ${strikes + 1}/5 Strikes`, ephemeral: true})

        });
    });
    db.close();
}

function addStrike(interaction, strike, reason){
    let user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.get('user').value)
    let mutedby = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id).user.id
    let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);}});
    db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS mutes (User text, Reason text, MutedBy text, Strike integer, Date text)`).run().finalize();});
    db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_positions_User on mutes(User)')
    db.run('REPLACE INTO mutes (User, Reason, MutedBy, Strike, Date) VALUES($User, $Reason, $MutedBy, $Strike, $Date)', [user.id, reason, mutedby, strike, Date.now()], function (err) {
        if (err) {
            return console.log(`Join ${err.message}`)
        } else {
            sendPM(user, `You have been Muted in the Game Boy Discord with the following Reason: \`${reason}\`, strike ${strike}/5`);
        }
    })
    db.close()
}

module.exports = {

    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute & Strike a user')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Target User')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Mute Reason')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    name: 'mute',
    description: 'Mute a user, this will automatically increase based on previous mutes.',
    defaultPermission: false,
    options: [
        {
            "name": "user",
            "description": "Target User",
            "type": 'USER',
            "required": true
        },
        {
            "name": "reason",
            "description": "Reason for muting",
            "type": 'STRING',
            "required": true
        }
    ],
    execute: async function (interaction) {
        Strike(interaction);
    }
}