const sqlite3 = require('sqlite3');
const Discord = require("discord.js");

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
    execute: function (msg, args) {
        if (msg.member.roles.cache.find(r => r.name === "Yokoi Watch" || r.name === "MGB")) {
            let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);} console.log("Loaded Warning Database")});
            let member = msg.guild.members.cache.get(args[0].replace(/\D+/g, ''))
            if (member) {
                let data = [];
                db.serialize(() => {
                    db.all(`SELECT User as user, WarningMessage as warningMessage, WarnedBy as warnedBy, Date as date FROM warnings ORDER BY date DESC;`, (err, rows) => {
                        if (err) {console.log(err)}
                        rows.forEach((row) => {
                            if (row.user === member.id) {
                                data.push(row);
                            }
                        })
                        if (data[0] !== undefined) {
                            let wMember = msg.guild.members.cache.get(data[0].user.replace(/\D+/g, ''))
                            let wWarnee1 = msg.guild.members.cache.get(data[0].warnedBy.replace(/\D+/g, ''))
                            let wWarnee2;
                            let wWarnee3;
                            if(data[1] !== undefined) {wWarnee2 = msg.guild.members.cache.get(data[1].warnedBy.replace(/\D+/g, ''));}
                            if(data[2] !== undefined) {wWarnee3 = msg.guild.members.cache.get(data[2].warnedBy.replace(/\D+/g, ''));}
                            if (wMember) {
                                const Embed = new Discord.MessageEmbed();
                                Embed.setColor('#9E7AC9');
                                Embed.setTitle(wMember.user.tag + "'s 3 Last Warnings");
                                if(data[0] && wWarnee1) {Embed.addField("Warning Message", data[0].warningMessage, true); Embed.addField("Warned By", wWarnee1.user.tag, true); Embed.addField("Date", new Date(Math.trunc(data[0].date)).toDateString(), true)}
                                if(data[1] && wWarnee2) {Embed.addField("Warning Message", data[1].warningMessage, true); Embed.addField("Warned By", wWarnee2.user.tag, true); Embed.addField("Date", new Date(Math.trunc(data[1].date)).toDateString(), true)}
                                if(data[2] && wWarnee3) {Embed.addField("Warning Message", data[2].warningMessage, true); Embed.addField("Warned By", wWarnee3.user.tag, true); Embed.addField("Date", new Date(Math.trunc(data[2].date)).toDateString(), true)}
                                msg.channel.send(embed=Embed)
                            }
                        } else {
                            msg.channel.send("User has no warnings.")
                        }
                    });
                });
            } else {
                msg.channel.send("Could not find that user in this guild")
            }
            db.close()
        }
    }
}