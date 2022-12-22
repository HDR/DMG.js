const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require("discord.js");
const { logChannel, role } = require("./config/setrules.json")
const moment = require("moment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrules')
        .setDescription('Set the rules message')
        .addChannelOption(option =>
        option.setName('target')
            .setDescription('target channel')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    execute: async function (interaction) {
        const modalButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('setrules.open_modal').setLabel('I have read the rules').setStyle("Success"))
        await interaction.options.getChannel('target').messages.fetch({limit:1}).then(msg => msg.first().edit({content: `${msg.first().content}`, components: [modalButton]}))
        interaction.reply({content: `Set ${interaction.options.getChannel('target')} as the Rules channel`, ephemeral: true})

    },

    open_modal: async function (interaction) {
        const modal = new ModalBuilder()
            .setCustomId('setrules.submit_modal')
            .setTitle('Gameboy Discord Rules')

        const answer = new TextInputBuilder()
            .setCustomId('secret')
            .setLabel('Show us that you have read the rules')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(32)
            .setRequired(true)

        const answerRow = new ActionRowBuilder().addComponents(answer)
        modal.addComponents(answerRow)
        await interaction.showModal(modal)
    },

    submit_modal: async function (interaction) {
        const RuleEmbed = new EmbedBuilder();
        if(interaction.components[0].components[0].value === `${interaction.member.name}` || `${interaction.member.nickname}` || `${interaction.user.username}#${interaction.user.discriminator}` || `${interaction.member.id}` ) {
            RuleEmbed.setColor('#90EE90')
                .setTitle(`${interaction.user.username}#${interaction.user.discriminator} has cleared the rules`)
                .addFields({name: 'Time Taken:', value: moment.duration(moment(interaction.member.joinedAt).diff(moment().now)).humanize()})
            await interaction.member.roles.add(role)
        } else {
            await interaction.member.timeout(120000, 'Automated Timeout, please read the rules')
            RuleEmbed.setColor('#ff2828')
                .setTitle(`${interaction.user.username}#${interaction.user.discriminator} entered the wrong phrase in rules`)
                .addFields({name: "Phrase Used:", value: `${interaction.components[0].components[0].value}`})
        }
        await interaction.guild.channels.cache.get(logChannel).send({embeds: [RuleEmbed]})
        await interaction.deferUpdate()
    }
}