const Discord = require("discord.js");
const {client} = require("../constants");

module.exports = {
    name: 'hide',
    description: 'Hide or un-hide channels',
    options: [
        {
            "name": "gameboy",
            "description": "hide/un-hide #gameboy",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "gallery",
            "description": "hide/un-hide #gallery",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "modding",
            "description": "hide/un-hide #modding",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "gotm",
            "description": "hide/un-hide #gotm",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "troubleshooting",
            "description": "hide/un-hide #troubleshooting",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "development",
            "description": "hide/un-hide #development",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "off-topic",
            "description": "hide/un-hide #off-topic",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "games",
            "description": "hide/un-hide #games",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "pokemon",
            "description": "hide/un-hide #pokémon",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "media",
            "description": "hide/un-hide #media",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "marketplace",
            "description": "hide/un-hide #marketplace",
            "type": 'SUB_COMMAND'
        }
    ],
    execute: function (interaction) {

        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#00aaaa');
        let role_id;
        const member = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id)
        switch(interaction.options._subcommand.toString()){

            case 'gameboy':
                role_id = '895695683745640479'
                break;

            case 'gallery':
                role_id = '895695747171901440'
                break;

            case 'modding':
                role_id = '895695753303965736'
                break;

            case 'gotm':
                role_id = '895695756378406923'
                break;

            case 'troubleshooting':
                role_id = '895695848082645023'
                break;

            case 'development':
                role_id = '895695912314232852'
                break;

            case 'off-topic':
                role_id = '895695913635418113'
                break;

            case 'games':
                role_id = '895695916449824828'
                break;

            case 'pokemon':
                role_id = '895695918786035742'
                break;

            case 'media':
                role_id = '895695921910784011'
                break;

            case 'marketplace':
                role_id = '895695924083445800'
                break;

        }

        if(!member.roles.cache.has(role_id)){
            member.roles.add(member.guild.roles.cache.find(role => role.id === role_id)).then();
            interaction.reply({ content: `${interaction.options._subcommand.toString()} has been hidden`, ephemeral: true})
        } else {
            member.roles.remove(member.guild.roles.cache.find(role => role.id === role_id)).then();
            interaction.reply({ content: `${interaction.options._subcommand.toString()} has been un-hidden`, ephemeral: true})
        }

    }
}