const sqlite3 = require('sqlite3');
const Discord = require("discord.js");
const constants = require('../constants')

module.exports = {
    name: 'warnings',
    aliases: ['wget'],
    description: 'Get user warnings',
    options: [
        {
            "name": "User",
            "description": "User to warn",
            "type": 6,
            "required": true
        }
    ],
    choices: [],
    execute: function (channel, args, member, interaction) {
        if (member.roles.cache.find(r => r.name === "Yokoi Watch" || r.name === "MGB")) {
            let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);} console.log("Loaded Warning Database")});
            let user = channel.guild.members.cache.get(args[0].value)
            if (user) {
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
                                const Embed = new Discord.MessageEmbed();
                                Embed.setColor('#9E7AC9');
                                Embed.setTitle(wMember.user.tag + "'s 3 Last Warnings");
                                if(data[0] && wWarnee1) {Embed.addField("Warning Message", data[0].warningMessage, true); Embed.addField("Warned By", wWarnee1.user.tag, true); Embed.addField("Date", new Date(Math.trunc(data[0].date)).toDateString(), true)}
                                if(data[1] && wWarnee2) {Embed.addField("Warning Message", data[1].warningMessage, true); Embed.addField("Warned By", wWarnee2.user.tag, true); Embed.addField("Date", new Date(Math.trunc(data[1].date)).toDateString(), true)}
                                if(data[2] && wWarnee3) {Embed.addField("Warning Message", data[2].warningMessage, true); Embed.addField("Warned By", wWarnee3.user.tag, true); Embed.addField("Date", new Date(Math.trunc(data[2].date)).toDateString(), true)}
                                constants.client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {embeds: [Embed]}}})

                            }
                        } else {
                            constants.client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: `User has no warnings`}}})
                        }
                    });
                });
            } else {
                constants.client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: `Could not find that user in this guild`}}})
            }
            db.close()
        }
    }
}