const sqlite3 = require('sqlite3');
const { MessageFlags, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
const {client} = require("../constants");
const {warn} = require("../commonFunctions");

async function getWarnings(interaction, self, warnInt, edit, userId) {
    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);}});
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        let user;

        if(edit) {
            user = channel.guild.members.cache.get(userId);
        } else {
            if(self) {
                user = interaction.user;
            } else {
                user = channel.guild.members.cache.get(interaction.options.get('user').value);
            }
        }

        let data = [];
        db.serialize(() => {
            db.all(`SELECT User as user, WarningMessage as warningMessage, WarnedBy as warnedBy, Date as date FROM warnings ORDER BY date DESC;`, (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                rows.forEach((row) => {
                    if (row.user === user.id) {
                        data.push(row);
                    }
                });

                if (data[0] !== undefined) {
                    if (channel.guild.members.cache.get(data[0].user.replace(/\D+/g, ''))) {
                        resolve({
                            "type": 17,
                            "accent_color": 10386121,
                            "components": [
                                {
                                    "type": 9,
                                    "accessory": {
                                        "type": 11,
                                        "media": {
                                            "url": `${user.displayAvatarURL()}`
                                        },
                                        "description": `${user.id}`
                                    },
                                    "components": [
                                        {
                                            "type": 10,
                                            "content": `## <@${user.id}>'s Warnings\n-# Warning ${warnInt + 1} of ${data.length}\n**Date:** <t:${Math.trunc(data[warnInt].date / 1000)}>`
                                        },
                                        {
                                            "type": 10,
                                            "content": `${data[warnInt].warningMessage}`
                                        },
                                        {
                                            "type": 10,
                                            "content": `**Warned By:** <@${data[warnInt].warnedBy}>`
                                        }
                                    ]
                                },
                                {
                                    "type": 14,
                                    "divider": true,
                                    "spacing": 1
                                },
                                {
                                    "type": 1,
                                    "components": [
                                        {
                                            "type": 2,
                                            "style": 1,
                                            "label": "Previous",
                                            "disabled": warnInt === 0,
                                            "custom_id": "previous"
                                        },
                                        {
                                            "type": 2,
                                            "style": 1,
                                            "label": "Next",
                                            "disabled": warnInt + 1 === data.length,
                                            "custom_id": "next"
                                        }
                                    ]
                                }
                            ]
                        });
                    }
                }
            });
        });
        db.close();
    });
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Check your warnings')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user'))
        .setDMPermission(false),

    execute: async function (interaction) {
        await interaction.deferReply({flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
        let warningMessage;
        if (interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            if (interaction.options.get('user')) {
                warningMessage = await getWarnings(interaction, false, 0);
            } else {
                warningMessage = await getWarnings(interaction, true, 0);
            }
        } else {
            if (interaction.options.get('user')) {
                interaction.editReply({ content: 'You\'re not allowed to check the warnings of others, please use /warnings without specifying a user', ephemeral: true});
            } else {
                warningMessage = await getWarnings(interaction, true, 0);
            }
        }
        await interaction.editReply({components: [warningMessage], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
    },

    next: async function (interaction) {
        await interaction.deferUpdate({flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
        let userId = interaction.message.components[0].components[0].accessory.description
        let warnCont = interaction.message.components[0].components[0].components[0].content
        const getInt = warnCont.match(/-# Warning (\d+)/);
        await interaction.editReply({components: [await getWarnings(interaction, false, parseInt(getInt[1], 10), true, userId)], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})

    },

    previous: async function (interaction) {
        await interaction.deferUpdate({flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
        let userId = interaction.message.components[0].components[0].accessory.description
        let warnCont = interaction.message.components[0].components[0].components[0].content
        const getInt = warnCont.match(/-# Warning (\d+)/);
        await interaction.editReply({components: [await getWarnings(interaction, false, parseInt(getInt[1], 10)-2, true, userId)], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
    }
}