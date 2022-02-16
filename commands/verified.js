const {MessageActionRow, TextInputComponent, MessageButton, MessageEmbed} = require("discord.js");
const constants = require("../constants");
const {client} = require("../constants");
module.exports = {
    name: 'verified', //name is the actual slash command used in discord, this can be anything without spaces.
    description: 'Verified modder form', //description is the command description as shown in discord.
    defaultPermission: true,
    options: [],

    execute: async function (interaction) {
        const modalButton = new MessageActionRow().addComponents(new MessageButton().setCustomId('open_modal').setLabel('Continue').setStyle("SUCCESS"))


        const Embed = new MessageEmbed();
        Embed.setColor('#9900ff')
        Embed.setTitle('Verified Modder Application Form')
        Embed.setDescription('The Verified Modder role is granted to those who display an acceptable level of knowledge in Game Boy modding/electronics repair/software and/or hardware development as well as the temperament necessary to reflect the rules and guidelines of the server. It is a testament to a user\'s technical skills as well as their character and how they conduct themselves online. \n' +
            '\n' +
            'The Verified Modder role is approved by a panel of jurors on the Admin team and Verified Modders are permitted to sell modding and other related services in the Game Boy Discord Marketplace channel. The contents of this application as well as the applicant\'s history on the Game Boy and affiliated Discord servers will be taken into consideration. Failure to follow the rules and guidelines of the server may result in the role being revoked.')


        interaction.reply({embeds: [Embed], components: [modalButton], ephemeral: true})

    },

    open_modal: async function (interaction) {

        const modal = {
            title: "Verified Modder Application",
            custom_id: "verified.submit_modal",
            components: [
                {
                    type: 1,
                    components: [{
                        type: 4,
                        style: 2,
                        custom_id: "verified_mod_application_paragraph",
                        label: 'Why do you want to be a verified modder?',
                        placeholder: 'Describe why you are applying to become a verified modder',
                        min_length: 128,
                        required: true
                    }]
                },
                {
                    type: 1,
                    components: [{
                        type: 4,
                        style: 1,
                        custom_id: "verified_mod_application_experience",
                        label: 'How long have you been modding Game Boys?',
                        placeholder: 'X Years, X Months',
                        min_length: 1,
                        max_length: 32,
                        required: true
                    }]
                },
                {
                    type: 1,
                    components: [{
                        type: 4,
                        style: 2,
                        custom_id: "verified_mod_application_images",
                        label: 'Please provide some images of your work',
                        placeholder: 'Paste image links here',
                        min_length: 8,
                        required: true
                    }]
                }
            ]
        }

        constants.client.api.interactions(interaction.id)[interaction.token].callback.post({ data: { type: 9, data: modal}})
    },

    submit_modal: async function (interaction) {

        const ResponseEmbed = new MessageEmbed();
        ResponseEmbed.setColor('#90EE90').setTitle('Verified Modder Application Submitted').setDescription('Thank you for submitting your application. We will review your application and get back to you as soon as possible, please do not submit multiple forms')

        const StaffEmbed = new MessageEmbed();
        StaffEmbed.setColor('#90EE90')
        StaffEmbed.setTitle('A new verified modder application has been submitted')
        StaffEmbed.addField('User', `${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})`)
        StaffEmbed.addField('Why do you want to be a verified modder?', interaction.components[0].components[0].value)
        StaffEmbed.addField('How long have you been modding Game Boys?', interaction.components[1].components[0].value)
        StaffEmbed.addField('Please provide some images of your work', interaction.components[2].components[0].value)

        let guild = client.guilds.cache.get('246604458744610816');

        interaction.reply({embeds: [ResponseEmbed], ephemeral: true}).then(await guild.channels.cache.get('793348250526154783').send({embeds: [StaffEmbed]}));
    }
}