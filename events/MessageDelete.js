const {client} = require("../constants");
const {Events, EmbedBuilder, Collection} = require("discord.js");
const { log_channel } = require("./config/events.json")


client.on(Events.MessageDelete, async(message) => {
    if(message.content) {
        let Embed = new EmbedBuilder()
        Embed.setColor('#ae3ffd')
        Embed.setAuthor({name: `${message.author.username}#${message.author.discriminator}`, iconURL: `${message.author.displayAvatarURL()}`})
        Embed.setDescription(`Message deleted in in <#${message.channel.id}>`)
        Embed.addFields(
            {
                name: 'Content',
                value: `${message.content}`
            },
            {
                name: 'Date',
                value: `<t:${Math.trunc(Date.now()/1000)}:F>`
            }
        )


        Embed.addFields(
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${message.author.id}\n[0;32mMessage = ${message.id}\`\`\``
            }
        )

        Embed.setTimestamp()
        Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})

        await message.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    }

    if(message.attachments.size > 0) {
        let embeds = new Collection();
        message.attachments.forEach(function(attachment) {
            embeds.set(attachment.id, new EmbedBuilder().setColor('#ae3ffd').setDescription(`Attachments for deleted message in <#${message.channel.id}>`).setAuthor({name: `${message.author.username}#${message.author.discriminator}`, iconURL: `${message.author.displayAvatarURL()}`}).addFields( { name: 'ID', value: `\`\`\`ansi\n[0;33mMember = ${message.author.id}\n[0;32mMessage = ${message.id}\`\`\`` }).setURL('https://discord.gg/gameboy').setImage(attachment.url).setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`}).setTimestamp())
        })
        try {
            await message.guild.channels.cache.get(log_channel).send({embeds: Array.from(embeds.values())});
        } catch (e) {
            console.log(e)
        }
    }
})