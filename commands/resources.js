const { Permissions } = require("discord.js")
const {client} = require("../constants");

module.exports = {
    name: 'resources',
    description: 'Resources Master Command',
    default_member_permissions: false,
    dm_permission: false,
    options: [
        {
            "name": "add",
            "description": "Add a new resource",
            "type": 'SUB_COMMAND',
            "options": [
                {
                    "name": "add_url",
                    "description": "Link to the message you want added to resources as an embed",
                    "type": "STRING",
                    "required": true
                }
            ]
        },
        {
            "name": "edit",
            "description": "Edit an existing resource",
            "type": 'SUB_COMMAND',
            "options": [
                {
                    "name": "edit_url",
                    "description": "Link to the message you want to edit",
                    "type": "STRING",
                    "required": true
                },
                {
                    "name": "new_url",
                    "description": "Link to the message you want to replace the old embed with",
                    "type": "STRING",
                    "required": true
                }
            ]
        },
        {
            "name": "delete",
            "description": "Delete an existing resource",
            "type": 'SUB_COMMAND',
            "options": [
                {
                    "name": "delete_url",
                    "description": "Link to the resource you want to delete",
                    "type": "STRING",
                    "required": true
                }
            ]
        }
    ],

    execute: function (interaction) {
        const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
        let resource_channel = client.guilds.cache.get(interaction.guildId).channels.cache.get('998610706133954830');
        switch(interaction.options._subcommand.toString()){
            case 'add':
                let add_url = interaction.options.get('add_url').value.split('/');
                let add_channel = channel.client.channels.cache.get(add_url[5])
                add_channel.messages.fetch(add_url[6]).then(msg => {
                    const json = JSON.parse(msg.content.replaceAll('```', ''))
                    resource_channel.send({embeds: [json.embeds[0]]})
                    interaction.reply({content: `Added Message to ${resource_channel}`})
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
                            interaction.reply({content: `Edited message in ${resource_channel}`, ephemeral: true });
                        })
                    })
                } else {
                    interaction.reply({content: `Only messages in ${resource_channel} can be edited`, ephemeral: true });
                }
                break;

            case 'delete':
                let delete_url = interaction.options.get('delete_url').value.split('/');
                let delete_channel = channel.client.channels.cache.get(delete_url[5])
                if(delete_channel === resource_channel) {
                    delete_channel.messages.fetch(delete_url[6]).then(msg => {
                        msg.delete().then()
                        interaction.reply({content: `Deleted message in ${resource_channel}`, ephemeral: true });
                    })
                } else {
                    interaction.reply({content: `Only messages in ${resource_channel} can be deleted`, ephemeral: true });
                }
        }
    }
}