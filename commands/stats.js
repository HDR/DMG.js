const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Displays user statistics')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target User Mod/Admin Only'))
        .setDMPermission(false),

    execute: async function (interaction) {
        const Embed = new EmbedBuilder();
        Embed.setColor('#FCBA03');
        Embed.setTitle("User Statistics");
        if (!interaction.options.getMember('user')) {
            Embed.setImage(interaction.member.user.avatarURL())
            console.log(interaction.member.joinedAt)
            Embed.addFields(
                {name: 'User', value: `${interaction.member.user.tag}`, inline: true}, {name: 'ID', value: interaction.member.id, inline: true},
                {name: '‎', value: '‎', inline: true},
                {name: 'Join Date', value: new Date(interaction.member.joinedAt).toDateString(), inline: true},
                {name: 'Account Age', value: `${(new Date(Math.abs(interaction.member.user.createdAt - Date.now()))/1000/60/60/24|0)} Days`,inline: true},
                {name: '‎', value: '‎', inline: true}
            )
            interaction.reply({ embeds: [Embed], ephemeral: true });

        } else {
            if (interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
                Embed.setImage(interaction.options.getUser('user').avatarURL())
                Embed.addFields(
                    {name: 'User', value: `${interaction.options.getUser('user').tag}`, inline: true},
                    {name: 'ID', value: interaction.options.getUser('user').id, inline: true},
                    {name: '‎', value: '‎', inline: true},
                    {name: 'Join Date', value: new Date(interaction.options.getMember('user').joinedTimestamp).toDateString(), inline: true},
                    {name: 'Account Age', value: `${(new Date(Math.abs(interaction.options.getUser('user').createdAt - Date.now()))/1000/60/60/24|0)} Days`, inline: true}
                )
                await interaction.reply({ embeds: [Embed], ephemeral: true });
            } else {
                interaction.reply({ content: 'Only moderators and above may check the stats of others, please use /stats without specifying a user to check your own stats.', ephemeral: true });
            }

        }
    },
}