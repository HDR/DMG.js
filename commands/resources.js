const { SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")
const { client } = require("../constants");
const { channel_id } = require("./config/resources.json")

module.exports = {

    data: new SlashCommandBuilder()
        .setName('resources')
        .setDescription('Resources Management Command')
        .addSubcommand(command =>
            command.setName('add')
            .setDescription('Add a new resource embed')
            .addStringOption(option =>
                option.setName('add_url')
                .setDescription('Link to the message you want added to resources as an embed')
                .setRequired(true)))
        .addSubcommand(command =>
                command.setName('edit')
                .setDescription('Edit an existing resource embed')
                .addStringOption(option =>
                        option.setName('edit_url')
                        .setDescription('Link to the message you want to edit')
                        .setRequired(true))
                .addStringOption(option =>
                        option.setName('new_url')
                        .setDescription('Link to the message you want to replace the old embed with')
                        .setRequired(true)))
        .addSubcommand(command =>
                command.setName('delete')
                .setDescription('Delete an existing resource embed')
                .addStringOption(option =>
                        option.setName('delete_url')
                        .setDescription('Link to the resource embed you want to delete')
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),

    execute: function (interaction) {
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        let resource_channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(channel_id);
        switch(interaction.options._subcommand.toString()){
            case 'add':
                let add_url = interaction.options.get('add_url').value.split('/');
                let add_channel = channel.client.channels.cache.get(add_url[5])
                add_channel.messages.fetch(add_url[6]).then(msg => {
                    console.log(msg.content)
                    const json = JSON.parse(msg.content.replaceAll('```', ''))
                    resource_channel.send({embeds: [json.embeds[0]]})
                    interaction.reply({content: `Added embed to ${resource_channel}`})
                })
                break;

            case 'edit':
                let edit_url = interaction.options.get('edit_url').value.split('/')
                let new_url = interaction.options.get('new_url').value.split('/')
                let edit_channel = channel.client.channels.cache.get(edit_url[5])
                let new_channel = channel.client.channels.cache.get(new_url[5])
                if(edit_channel === resource_channel) {
                    edit_channel.messages.fetch(edit_url[6]).then(msg => {
                        new_channel.messages.fetch(new_url[6]).then(nmsg => {
                            msg.edit(JSON.parse(nmsg.content.replaceAll('```', ''))).then()
                            interaction.reply({content: `Edited resource embed in ${resource_channel}`, ephemeral: true });
                        })
                    })
                } else {
                    interaction.reply({content: `Only embeds in ${resource_channel} can be edited`, ephemeral: true });
                }
                break;

            case 'delete':
                let delete_url = interaction.options.get('delete_url').value.split('/');
                let delete_channel = channel.client.channels.cache.get(delete_url[5])
                if(delete_channel === resource_channel) {
                    delete_channel.messages.fetch(delete_url[6]).then(msg => {
                        msg.delete().then()
                        interaction.reply({content: `Deleted resource embed in ${resource_channel}`, ephemeral: true });
                    })
                } else {
                    interaction.reply({content: `Only embeds in ${resource_channel} can be deleted`, ephemeral: true });
                }
        }
    }
}