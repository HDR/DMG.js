const { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require("discord.js");
const {client} = require("../constants");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Report Message')
        .setType(ApplicationCommandType.Message),

    execute: async function (interaction) {
        await interaction.deferReply({ephemeral: true})
        const Embed = new EmbedBuilder();
        Embed.setFooter({text: interaction.targetId})
        let channel = await client.channels.cache.get(interaction.channelId)
        let message = await channel.messages.fetch(interaction.targetId)
        let user = await client.users.fetch(message.author.id);

        switch(true) {
            case (channel.id === '744938437693407393'):
                Embed.setTitle(`Report Gallery Post`)
                    .addFields({
                        name: 'Message',
                        value: `[Link to message](${message.url})`
                    })
                    .setDescription(`Posted By ${user} (${interaction.targetId})`)
                    .setFooter({text: `${interaction.targetId}`})

                const gallery_options = new StringSelectMenuBuilder()
                    .setCustomId('Report Message.reason')
                    .setPlaceholder('Rule Broken')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 1')
                            .setDescription('Images and videos only')
                            .setValue('1'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 2')
                            .setDescription('Low quality or low effort post')
                            .setValue('2'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 3')
                            .setDescription('Game Boy related content only')
                            .setValue('3'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 4')
                            .setDescription('No advertising in gallery')
                            .setValue('4'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Custom')
                            .setDescription('Custom report reason')
                            .setValue('custom'),
                    );
                const rrow = new ActionRowBuilder().addComponents(gallery_options)
                await interaction.editReply({embeds: [Embed], components: [rrow], ephemeral: true})
                break;

            case (channel.parentId === '1049401311101206649'):
                Embed.setTitle(`Report Marketplace Post/Message`)
                    .addFields({
                        name: 'Message',
                        value: `[Link to message](${message.url})`
                    })
                    .setDescription(`Posted By ${user} (${interaction.targetId})`)
                    .setFooter({text: `${interaction.targetId}`})

                const market_options = new StringSelectMenuBuilder()
                    .setCustomId('Report Message.reason')
                    .setPlaceholder('Rule Broken')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 1')
                            .setDescription('New users are not able to use the marketplace')
                            .setValue('1'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 2')
                            .setDescription('Only @Verified Modder & @Store/Retailer are allowed to offer modding services')
                            .setValue('2'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 3')
                            .setDescription('Please include a price & a photo')
                            .setValue('3'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 4')
                            .setDescription('Do not misrepresent your item/No Raffles')
                            .setValue('4'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 5')
                            .setDescription('Once your listing is no longer needed, please delete your post!')
                            .setValue('5'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 6')
                            .setDescription('Avoid random chatter')
                            .setValue('6'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Custom')
                            .setDescription('Custom report reason')
                            .setValue('custom'),
                    );
                const mrow = new ActionRowBuilder().addComponents(market_options)
                await interaction.editReply({embeds: [Embed], components: [mrow], ephemeral: true})
                break;

            case (channel.parentId === '1006386432065155083'):
                Embed.setTitle(`Report Troubleshooting Post/Message`)
                    .addFields({
                        name: 'Message',
                        value: `[Link to message](${message.url})`
                    })
                    .setDescription(`Posted By ${user} (${interaction.targetId})`)
                    .setFooter({text: `${interaction.targetId}`})

                const trouble_options = new StringSelectMenuBuilder()
                    .setCustomId('Report Message.reason')
                    .setPlaceholder('Rule Broken')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 1')
                            .setDescription('No jokes or memes')
                            .setValue('1'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 2')
                            .setDescription('Avoid random chatter')
                            .setValue('2'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 3')
                            .setDescription('Dangerous or misleading')
                            .setValue('3'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 4')
                            .setDescription('Insufficient information')
                            .setValue('4'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Custom')
                            .setDescription('Custom report reason')
                            .setValue('custom'),
                    );
                const trow = new ActionRowBuilder().addComponents(trouble_options)
                await interaction.editReply({embeds: [Embed], components: [trow], ephemeral: true})
                break;

            default:
                Embed.setTitle(`Report Post/Message`)
                    .addFields({
                        name: 'Message',
                        value: `[Link to message](${message.url})`
                    })
                    .setDescription(`Posted By ${user} (${interaction.targetId})`)
                    .setFooter({text: `${interaction.targetId}`})

                const default_options = new StringSelectMenuBuilder()
                    .setCustomId('Report Message.reason')
                    .setPlaceholder('Rule Broken')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 1')
                            .setDescription('Don\'t be an asshole')
                            .setValue('1'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 2')
                            .setDescription('Use common sense')
                            .setValue('2'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 3')
                            .setDescription('No Advertising')
                            .setValue('3'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 4')
                            .setDescription('Piracy is not allowed')
                            .setValue('4'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Rule 5')
                            .setDescription('Keep topics in the correct channels')
                            .setValue('5'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Custom')
                            .setDescription('Custom report reason')
                            .setValue('custom'),
                    );
                const drow = new ActionRowBuilder().addComponents(default_options)
                await interaction.editReply({embeds: [Embed], components: [drow], ephemeral: true})
                break;
        }
    },

    reason: async function(interaction) {
        let targetId = interaction.message.embeds[0].footer.text
        let rule = '';
        let chnl = await client.channels.cache.get(interaction.channelId)

        switch(true) {
            case (interaction.channelId === '744938437693407393'):
                rule = ['Gallery Rule 1: Images and videos only. Captions are allowed, but any chatter will be automatically removed', 'Gallery Rule 2: Low quality or low effort posts will be removed, ie blurry pictures, bootleg carts, screenshots etc. Gallery is CURATED, put your best foot forward when posting!', 'Gallery Rule 3: Game Boy related content only. Other Nintendo consoles will be removed.', 'Gallery Rule 4: No advertising in gallery without the approval of the admins. (This includes stealth advertising)']
                break;

            case (chnl.parentId === '1049401311101206649'):
                rule = ['Marketplace Rule 1: New users are not able to use the marketplace, users that have been in the discord for less than 30 days or have an account that is younger than 90 days will have their posts removed.', 'Marketplace Rule 2: Only users with the following roles - @Verified Modder & @Store/Retailer are allowed to offer modding services.', 'Marketplace Rule 3: If selling, please include a price, country, and at least one photo.', 'Marketplace Rule 4: Do not misrepresent your item! Communicate as much detail about the item before finalizing a sale/trade. Raffle-type promotions or sales are not allowed.', 'Marketplace Rule 5: Once your listing is no longer needed, please delete your post!', 'Marketplace Rule 6: Avoid random chatter, repeat offenses will result in restricted access to marketplace.']
                break;

            case (chnl.parentId === '1006386432065155083'):
                rule = ['Troubleshooting Rule 1: troubleshooting is a serious channel, that means no jokes or memes in response to people asking for help', 'Troubleshooting Rule 2: Avoid random chatter in troubleshooting', 'Troubleshooting Rule 3: Please avoid suggestions that are dangerous or misleading.', 'Troubleshooting Rule 4: Add as much information about your problem as possible, include pictures and a proper description of your issue. (Posts with insufficient details may be deleted)']
                break;

            default:
                rule = ['Rule 1: Don\'t be an asshole, we expect a minimum level of maturity and conduct in the server', 'Rule 2: Use common sense, avoid obviously adult topics, slurs, politics, etc', 'Rule 3: Advertising (products/giveaways/self promotion) must be run past @Yokoi Watch via private message', 'Rule 4: Piracy is not allowed, this includes ROM files and or links to websites containing rom files', 'Rule 5: Keep topics in the correct channels, Channel specific rules can be found in the respective channel\'s description']
                break;
        }

        if(interaction.values[0] === 'custom') {
            const modal = new ModalBuilder()
                .setCustomId(`Report Message.submit_modal.${interaction.channelId}.${targetId}.${chnl.name}`)
                .setTitle(`Custom Report Reason`)

            const paragraph = new TextInputBuilder()
                .setCustomId('Report Message.parahraph')
                .setLabel('Report Reason')
                .setPlaceholder('Reason for why this message should be reported',)
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(128)
                .setRequired(true)

            const paragraphRow = new ActionRowBuilder().addComponents(paragraph)
            modal.addComponents(paragraphRow)
            await interaction.showModal(modal)
        } else {
            report(interaction, interaction.channelId, targetId, rule[parseInt(interaction.values) - 1])
        }

    },

    submit_modal: async function (interaction) {
        let channelId = interaction.customId.split('.')[2]
        let targetId = interaction.customId.split('.')[3]
        report(interaction, channelId, targetId, interaction.components[0].components[0].value)
    }
}

async function report (interaction, channelId, targetId, reason) {
    let channel = await client.channels.cache.get(interaction.channelId)
    let message = await channel.messages.fetch(targetId)
    let user = await client.users.fetch(message.author.id);
    await interaction.update({content: `${user}'s post in ${channel} has been reported with the following reason: \`${reason}\` \nMisleading reports, or abuse of this system may result in a ban.`, embeds: [], components: [], ephemeral: true})

    const ReportEmbed = new EmbedBuilder();
    ReportEmbed.setColor('#32caff')
    ReportEmbed.setAuthor({name: `${interaction.user.username} | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL()})
    ReportEmbed.setTitle('A message has been reported')
    ReportEmbed.addFields({name: 'Author', value: user.username, inline: true})
    ReportEmbed.addFields({name: 'Channel', value: `<#${channel.id}>`, inline: true})
    ReportEmbed.addFields({name: 'Report Reason', value: reason, inline: false})
    ReportEmbed.addFields({name: 'Message', value: `[Go To Message](${message.url})`})
    ReportEmbed.addFields({name: 'ID', value: `\`\`\`ansi\n[0;32mReported User = ${user.id}\n[0;33mMessage ID = ${targetId}\n[0;34mReporter = ${interaction.user.id}\`\`\``})

    await interaction.guild.channels.cache.get('793348250526154783').send({embeds: [ReportEmbed]})

}