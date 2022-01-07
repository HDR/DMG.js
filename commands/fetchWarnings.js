const sqlite3 = require('sqlite3');
const { MessageEmbed } = require("discord.js");
const {client} = require("../constants");

function getWarnings(interaction, self) {
    let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);}});
    const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
    let user;
    if(self) {
        user = interaction.user;
    } else {
        user = channel.guild.members.cache.get(interaction.options.get('user').value)
    }
    let data = [];
    db.serialize(() => {
        db.all(`SELECT User as user, WarningMessage as warningMessage, WarnedBy as warnedBy, Date as date FROM warnings ORDER BY date DESC;`, (err, rows) => {
            if (err) {console.log(err)}
            rows.forEach((row) => {
                if (row.user === user.id) {
                    data.push(row);
                }
            })


            if (data[0] !== undefined) {
                let wMember = channel.guild.members.cache.get(data[0].user.replace(/\D+/g, ''))
                let wWarnee1 = channel.guild.members.cache.get(data[0].warnedBy.replace(/\D+/g, ''))
                let wWarnee2;
                let wWarnee3;
                if(data[1] !== undefined) {wWarnee2 = channel.guild.members.cache.get(data[1].warnedBy.replace(/\D+/g, ''));}
                if(data[2] !== undefined) {wWarnee3 = channel.guild.members.cache.get(data[2].warnedBy.replace(/\D+/g, ''));}

                if (wMember) {
                    const Embed = new MessageEmbed();
                    Embed.setColor('#9E7AC9');
                    Embed.setTitle(wMember.user.tag + "'s 3 Last Warnings");
                    if(data[0]) {Embed.addField("Warning Message", data[0].warningMessage, true); if(!self) {Embed.addField("Warned By", wWarnee1.user.tag, true);} else {Embed.addField("Warned By", 'REDACTED', true);} Embed.addField("Date", new Date(Math.trunc(data[0].date)).toDateString(), true)}
                    if(data[1]) {Embed.addField("Warning Message", data[1].warningMessage, true); if(!self) {Embed.addField("Warned By", wWarnee2.user.tag, true);} else {Embed.addField("Warned By", 'REDACTED', true);}Embed.addField("Date", new Date(Math.trunc(data[1].date)).toDateString(), true)}
                    if(data[2]) {Embed.addField("Warning Message", data[2].warningMessage, true); if(!self) {Embed.addField("Warned By", wWarnee3.user.tag, true);} else {Embed.addField("Warned By", 'REDACTED', true);}Embed.addField("Date", new Date(Math.trunc(data[2].date)).toDateString(), true)}
                    interaction.reply({ embeds: [Embed], ephemeral: true });

                }
            } else {
                interaction.reply({ content: 'User has no warnings', ephemeral: true});
            }
        });
    });
    db.close();
}

module.exports = {
    name: 'warnings',
    description: 'Get user warnings',
    defaultPermission: true,
    options: [
        {
            "name": "user",
            "description": "User to warn",
            "type": 'USER',
            "required": false
        }
    ],
    execute: function (interaction) {
        const member = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id)
        if (member.roles.cache.find(r => r.name === "Yokoi Watch" || r.name === "MGB")) {
            if (interaction.options.get('user')) {
                getWarnings(interaction, false);
            } else {
                getWarnings(interaction, true);
            }
        } else {
            if (interaction.options.get('user')) {
                interaction.reply({ content: 'You\'re not allowed to check the warnings of others, please use /warnings without specifying a user', ephemeral: true});
            } else {
                getWarnings(interaction, true);
            }
        }
    }
}