const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Send or edit a message as the bot')
        .addSubcommand(command =>
        command.setName('send')
            .setDescription('send a message to a channel')
            .addChannelOption(option =>
                option.setName('target')
                .setDescription('Target Channel')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('message')
                .setDescription('The message you want to send or an url to a code block containing a formatted message.')
                .setRequired(true))
        )
        .addSubcommand(command =>
        command.setName('edit')
            .setDescription('Edit a message sent by the bot')
            .addStringOption(option =>
                option.setName('url')
                .setDescription('URL to the message you want to edit')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('message')
                .setDescription('The message you want to send or an url to a code block containing a formatted message.')
                .setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: function (interaction) {
        switch (interaction.options._subcommand) {
            case 'send':
                if(interaction.options.get('message').value.startsWith('https://discord.com/channels/')){
                    let messageUrl = interaction.options.get('message').value.split('/')
                    interaction.guild.channels.cache.get(messageUrl[5]).messages.fetch(messageUrl[6]).then(message =>
                        interaction.options.getChannel('target').send({content: `${message.content.replaceAll('```', '')}`})
                    )
                } else {
                    interaction.options.getChannel('target').send({content: `${interaction.options.getString('message')}`})
                }
                interaction.reply({content: `Message was echoed to ${interaction.options.getChannel('target')}`, ephemeral: true });
                break;

            case 'edit':
                let urlSplit = interaction.options.get('url').value.split('/')
                if(interaction.options.get('message').value.startsWith('https://discord.com/channels/')){
                    let messageUrl = interaction.options.get('message').value.split('/')
                    interaction.guild.channels.cache.get(messageUrl[5]).messages.fetch(messageUrl[6]).then(message =>
                        interaction.guild.channels.cache.get(urlSplit[5]).messages.fetch(urlSplit[6]).then(msg => (msg.edit({content: `${message.content.replaceAll('```', '')}`})))
                    )
                } else {
                    interaction.guild.channels.cache.get(urlSplit[5]).messages.fetch(urlSplit[6]).then(msg => (msg.edit({content: `${interaction.options.getString('message')}`})))
                }
                interaction.reply({content: `Message was edited in ${interaction.guild.channels.cache.get(urlSplit[5])}`, ephemeral: true });
                break;
        }
    }
}