const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { client } = require("../constants");
const { guildId, channelId } = require("./config/verified.json")
module.exports = {

    data: new SlashCommandBuilder()
        .setName('verified')
        .setDescription('Apply to be a verified modder')
        .setDMPermission(false),

    execute: async function (interaction) {
        const modalButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('open_modal').setLabel('Continue').setStyle("Success"))


        const Embed = new EmbedBuilder();
        Embed.setColor('#9900ff')
        Embed.setTitle('Verified Modder Application Form')
        Embed.setDescription('The Verified Modder role is granted to those who display an acceptable level of knowledge in Game Boy modding/electronics repair/software and/or hardware development as well as the temperament necessary to reflect the rules and guidelines of the server. It is a testament to a user\'s technical skills as well as their character and how they conduct themselves online. \n' +
            '\n' +
            'The Verified Modder role is approved by a panel of jurors on the Admin team and Verified Modders are permitted to sell modding and other related services in the Game Boy Discord Marketplace channel. The contents of this application as well as the applicant\'s history on the Game Boy and affiliated Discord servers will be taken into consideration. Failure to follow the rules and guidelines of the server may result in the role being revoked.')


        interaction.reply({embeds: [Embed], components: [modalButton], ephemeral: true})

    },

    open_modal: async function (interaction) {

        const modal = new ModalBuilder()
            .setCustomId('submit_modal')
            .setTitle('Verified Modder Application Form')

        const paragraph = new TextInputBuilder()
            .setCustomId('verified_mod_application_paragraph')
            .setLabel('Why do you want to be a verified modder?')
            .setPlaceholder('Describe why you are applying to become a verified modder',)
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(128)
            .setRequired(true)

        const experience = new TextInputBuilder()
            .setCustomId('verified_mod_application_experience')
            .setLabel('How long have you been modding Game Boys?')
            .setPlaceholder('X Years, X Months')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(32)
            .setRequired(true)

        const images = new TextInputBuilder()
            .setCustomId('verified_mod_application_images')
            .setLabel('Please provide some images of your work')
            .setPlaceholder('Use Imgur & include pictures of internals')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(8)
            .setMaxLength(1024)
            .setRequired(true)

        const paragraphRow = new ActionRowBuilder().addComponents(paragraph)
        const experienceRow = new ActionRowBuilder().addComponents(experience)
        const imageRow = new ActionRowBuilder().addComponents(images)

        modal.addComponents(paragraphRow, experienceRow, imageRow)
        await interaction.showModal(modal)
    },

    submit_modal: async function (interaction) {

        const ResponseEmbed = new EmbedBuilder();
        ResponseEmbed.setColor('#90EE90').setTitle('Verified Modder Application Submitted').setDescription('Thank you for submitting your application. We will review your application and get back to you as soon as possible, please do not submit multiple forms')

        const StaffEmbed = new EmbedBuilder();
        StaffEmbed.setColor('#90EE90')
        StaffEmbed.setTitle('A new verified modder application has been submitted')
        StaffEmbed.addFields({name: 'User', value: `${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})`})
        let StrLength = interaction.components[0].components[0].value.length
        if(StrLength <= 1024) {
            StaffEmbed.addFields({name: 'Why do you want to be a verified modder?', value: interaction.components[0].components[0].value})
        } else {
            StaffEmbed.addFields({name: 'Why do you want to be a verified modder? #1', value: interaction.components[0].components[0].value.substr(0, 1024)})
            if(StrLength > 1024){StaffEmbed.addFields({name: 'Why do you want to be a verified modder? #1', value: interaction.components[0].components[0].value.substr(1024, 1024)})}
            if(StrLength > 2048){StaffEmbed.addFields({name: 'Why do you want to be a verified modder? #1', value: interaction.components[0].components[0].value.substr(2048, 1024)})}
            if(StrLength > 3072){StaffEmbed.addFields({name: 'Why do you want to be a verified modder? #1', value: interaction.components[0].components[0].value.substr(3072, 1024)})}
        }
        StaffEmbed.addFields({name: 'How long have you been modding Game Boys?', value: interaction.components[1].components[0].value})
        StaffEmbed.addFields({name: 'How long have you been modding Game Boys?', value: interaction.components[2].components[0].value})

        let guild = client.guilds.cache.get(guildId);

        interaction.reply({embeds: [ResponseEmbed], ephemeral: true}).then(await guild.channels.cache.get(channelId).send({embeds: [StaffEmbed]})).then(await guild.channels.cache.get(channelId).lastMessage.pin())
    }
}