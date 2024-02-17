const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription('Create or edit an emoji')
        .addSubcommand(command =>
            command.setName('create')
                .setDescription('create an emoji')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Emoji Name')
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option.setName('image')
                        .setDescription('128x128 Emoji Image')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('roles')
                        .setDescription('Roles that have access to the emoji'))
        )
        //.addSubcommand(command =>
        //    command.setName('edit')
        //        .setDescription('Edit an emoji')
        //        .addIntegerOption(option =>
        //            option.setName('id')
        //                .setDescription('Emoji ID')
        //                .setRequired(true))
        //        .addStringOption(option =>
        //            option.setName('name')
        //                .setDescription('The message you want to send or an url to a code block containing a formatted message.')
        //                .setRequired(true))
        //        .addStringOption(option =>
        //            option.setName('roles')
        //                .setDescription('Roles that have access to the emoji')
        //                .setRequired(true))
        //)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    execute: function (interaction) {
        switch (interaction.options._subcommand) {
            case 'create':
                let roles = interaction.options.getString('roles').replaceAll(new RegExp(/([<@&>])/g), '').split(' ')
                interaction.guild.emojis.create({name: interaction.options.getString('name'), attachment: interaction.options.getAttachment('image').attachment, roles: roles}).then(emoji => interaction.reply({content: `Created emoji "${emoji.name}" with the id: ${emoji.id}`, ephemeral: true}))
                break;

            case 'edit':
                //Todo: Implement
                break;
        }
    }
}