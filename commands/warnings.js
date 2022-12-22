const sqlite3 = require('sqlite3');
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
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
                if (channel.guild.members.cache.get(data[0].user.replace(/\D+/g, ''))) {
                    const Embed = new EmbedBuilder();
                    Embed.setColor('#9E7AC9');
                    Embed.setTitle(channel.guild.members.cache.get(data[0].user.replace(/\D+/g, '')).user.tag + "'s 3 Last Warnings");
                    if(data[0]) {Embed.addFields({name: "Warning Message", value: data[0].warningMessage, inline: true}, {name: "Warned By", value: channel.guild.members.cache.get(data[0].warnedBy.replace(/\D+/g, '')).user.tag, inline: true}, {name: "Date", value: `<t:${Math.trunc(data[0].date/1000)}>`, inline: true})}
                    if(data[1]) {Embed.addFields({name: "Warning Message", value: data[1].warningMessage, inline: true}, {name: "Warned By", value: channel.guild.members.cache.get(data[1].warnedBy.replace(/\D+/g, '')).user.tag, inline: true}, {name: "Date", value: `<t:${Math.trunc(data[1].date/1000)}>`, inline: true})}
                    if(data[2]) {Embed.addFields({name: "Warning Message", value: data[2].warningMessage, inline: true}, {name: "Warned By", value: channel.guild.members.cache.get(data[2].warnedBy.replace(/\D+/g, '')).user.tag, inline: true}, {name: "Date", value: `<t:${Math.trunc(data[2].date/1000)}>`, inline: true})}
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
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Check your warnings')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')),

    execute: function (interaction) {
        if (interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
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