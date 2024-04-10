const { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder} = require("discord.js");
const {client} = require("../constants");
const sqlite3 = require("sqlite3");
const {sendPM} = require("../commonFunctions");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Remove Post')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    execute: async function (interaction) {
        await interaction.deferReply({ephemeral: true})
        const Embed = new EmbedBuilder();
        let channel = await client.channels.cache.get(interaction.channelId)
        if(channel.id === '744938437693407393') {
            let message = await channel.messages.fetch(interaction.targetId)
            let user = await client.users.fetch(message.author.id);
            Embed.setTitle(`Remove Gallery Post`)
                .addFields({
                    name: 'Message',
                    value: `[Link to message](${message.url})`
                })
                .setDescription(`Posted By ${user} (${interaction.targetId})`)
                .setFooter({text: `${interaction.targetId}`})

            const rule_options = new StringSelectMenuBuilder()
                .setCustomId('Remove Post.remove')
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
                );
            const row = new ActionRowBuilder().addComponents(rule_options)
            await interaction.editReply({embeds: [Embed], components: [row], ephemeral: true})
        } else {
            await interaction.editReply({content: 'This command can only be used in gallery', ephemeral: true})
        }
    },

    remove: async function(interaction) {
        const rule = ['Rule 1: Images and videos only. Captions are allowed, but any chatter will be automatically removed', 'Rule 2: Low quality or low effort posts will be removed, ie blurry pictures, bootleg carts, screenshots etc. Gallery is CURATED, put your best foot forward when posting!', 'Rule 3: Game Boy related content only. Other Nintendo consoles will be removed.', 'Rule 4: No advertising in gallery without the approval of the admins. (This includes stealth advertising)']
        let reason = rule[parseInt(interaction.values) - 1]
        let channel = await client.channels.cache.get(interaction.channelId)
        let message = await channel.messages.fetch(interaction.targetId)
        let user = await client.users.fetch(message.first().author.id);
        await message.first().delete()
        //sendPM(user, `Your post in gallery has been removed: \`${reason}\``)
        await interaction.update({content: `Removed ${user.tag}'s gallery post: \`${reason}\``, embeds: [], components: [], ephemeral: true})

    }
}