const {client} = require("../constants");
const { REST }  = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('lookup')
        .setDescription('Look up users by id')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('ID you want to look up')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    execute: async function (interaction) {
        const rest = new REST({ version: '10' }).setToken(client.token);

        try {
            await rest.get(Routes.user(interaction.options.get('userid').value))
                .then(data => {
                    const Embed = new EmbedBuilder();
                    Embed.setColor(data.banner_color)
                        .setTitle(`User Details`)
                        .addFields({name: 'Username', value: `${data.username}#${data.discriminator}`, inline: false}, {name: 'ID', value: data.id, inline: false})
                        .setImage(`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`)
                    interaction.reply({ embeds: [Embed]});
                })
        } catch (error) {
            console.log(error)
        }
    },
}