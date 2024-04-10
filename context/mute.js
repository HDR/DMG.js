const { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder} = require("discord.js");
const {client} = require("../constants");
const sqlite3 = require("sqlite3");
const {sendPM} = require("../commonFunctions");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Mute')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    execute: async function (interaction) {
        await interaction.deferReply({ephemeral: true})
        let [Strikes, Reason] = await(getStrikes(interaction))

        const Embed = new EmbedBuilder();
        let user = await client.users.fetch(interaction.targetId);
        Embed.setTitle(`Mute & Strike User`)
            .setDescription(`${user} (${interaction.targetId})`)
            .setAuthor({name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}`})
            .setThumbnail(`${user.displayAvatarURL()}`)
            .addFields({
                    name: 'Current Strikes',
                    value: `${Strikes}`,
                    inline: true
                },
                {
                    name: 'Last Strike Reason',
                    value: `${Reason}`,
                    inline: true
                })
            .setFooter({text: `${interaction.targetId}`})

        const rule_options = new StringSelectMenuBuilder()
            .setCustomId('Mute.mute')
            .setPlaceholder('Rule Broken')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Rule 1')
                    .setDescription('Don\'t be an asshole, we expect a minimum level of maturity and conduct in the server')
                    .setValue('1'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Rule 2')
                    .setDescription('Use common sense, avoid obviously adult topics, slurs, politics, etc')
                    .setValue('2'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Rule 3')
                    .setDescription('Advertising (products/giveaways/self promotion) must be run past Yokoi Watch via private message')
                    .setValue('3'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Rule 4')
                    .setDescription('Piracy is not allowed, this includes ROM files and or links to websites containing rom files')
                    .setValue('4'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Rule 5')
                    .setDescription('Keep topics in the correct channels')
                    .setValue('5'),
            );

        const row = new ActionRowBuilder().addComponents(rule_options)
        await interaction.editReply({embeds: [Embed], components: [row], ephemeral: true})
    },

    mute: async function (interaction) {
        const rule = ["Rule 1: Don\'t be an asshole, we expect a minimum level of maturity and conduct in the server", "Rule 2: Use common sense, avoid obviously adult topics, slurs, politics, etc", "Rule 3: Advertising (products/giveaways/self promotion) must be run past Yokoi Watch via private message", "Rule 4: Piracy is not allowed, this includes ROM files and or links to websites containing rom files", "Rule 5: Keep topics in the correct channels"]
        let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);}});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS mutes (User text, Reason text, MutedBy text, Strike integer, Date text)`).run().finalize();});
        let user = await interaction.guild.members.cache.get(interaction.message.embeds[0].footer.text)
        db.serialize(() => {
            let data = [];
            let strikes = "";
            let date = "";
            db.all(`SELECT User as user, Reason as reason, MutedBy as mutedby, Strike as strike, Date as date FROM mutes ORDER BY date DESC;`, async (err, rows) => {
                if (err) {
                    console.log(err)
                }
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

                let reason = rule[parseInt(interaction.values) - 1];

                switch (strikes) {
                    case 0:
                        //Mute for 2 Hours
                        user.timeout(7200000, reason + ` - ${strikes + 1}/4 Strikes`).then(addStrike(interaction, 1, reason))
                        break;
                    case 1:
                        //Mute for 24 Hours
                        user.timeout(24 * 60 * 60 * 1000, reason + ` - ${strikes + 1}/4 Strikes`).then(addStrike(interaction, 2, reason))
                        break;
                    case 2:
                        //Mute for 1 Week
                        user.timeout(7 * 24 * 60 * 60 * 1000, reason + ` - ${strikes + 1}/4 Strikes`).then(addStrike(interaction, 3, reason))
                        break;
                    case 3:
                    //Ban
                    sendPM(user, `You have been banned from the Game boy discord for reaching 4 strikes`)
                    user.ban({reason: "Automatic Ban, user reached 4/4 strikes"}).then()

                }
                await interaction.update({content: `Muted ${user.user.username}#${user.user.discriminator}, this user now has ${strikes + 1}/4 Strikes`, embeds: [], components: [], ephemeral: true})

            });
        });
        db.close();
    }
}

async function addStrike(interaction, strike, reason){
    let user = await interaction.guild.members.cache.get(interaction.message.embeds[0].footer.text)
    let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);}});
    db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS mutes (User text, Reason text, MutedBy text, Strike integer, Date text)`).run().finalize();});
    db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_positions_User on mutes(User)')
    db.run('REPLACE INTO mutes (User, Reason, MutedBy, Strike, Date) VALUES($User, $Reason, $MutedBy, $Strike, $Date)', [user.id, reason, interaction.user.id, strike, Date.now()], function (err) {
        if (err) {
            return console.log(`Join ${err.message}`)
        } else {
            sendPM(user, `You have been Muted in the Game Boy Discord with the following Reason: \`${reason}\`, strike ${strike}/4`);
        }
    })
    db.close()
}


function getStrikes(interaction) {
    let user_id = interaction.targetId
    let db = new sqlite3.Database('./dmg.db', sqlite3.OPEN_READONLY ,(err) => {if (err) {console.log(err.message);}});
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`SELECT * FROM "mutes"`, (err, val) => {
                let i = 0;
                for(const [key, value] of Object.entries(val)) {
                    if(user_id === value.User) {
                        resolve([value.Strike, value.Reason])
                    }
                    if(i === Object.entries(val).length-1){
                        resolve(["No Strikes", "No Reason"])
                    }
                    i++
                }
            })
        })
    })
}