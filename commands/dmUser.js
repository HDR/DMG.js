const { SlashCommandBuilder, PermissionFlagsBits, Events, EmbedBuilder} = require("discord.js");
const { forum_channel, guild_id } = require('./config/dmUser.json')
const {client} = require("../constants");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Open a message channel with a the specified user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target User')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    execute: async function (interaction) {
        let i = false;
        interaction.options.getMember('user').createDM(true)
        interaction.options.getMember('user').send({content: "."}).catch(error => {
            interaction.reply({content: "Could not open a direct message channel with the requested user, they may not allow pm's from DMG", ephemeral: true})
            i = true;
        });
        if(!i){
            let forum = interaction.guild.channels.cache.get(forum_channel)
            forum.threads.create({
                name: `${interaction.options.getMember('user').user}`,
                message: { content: `Private Message Channel for ${interaction.options.getMember('user').user} (${interaction.options.getMember('user').id})`}
            })
            interaction.deferUpdate();
            i = false;
        }
    },
}

client.on(Events.MessageCreate, async msg => {
    let guild = client.guilds.cache.get(guild_id);
    let forum = guild.channels.cache.get(forum_channel)
    if (msg.channel.isThread && msg.channel.parentId === forum_channel && !msg.author.bot) {
        if(msg.content > 0 && msg.attachments <= 0) {
            guild.members.cache.get(msg.channel.name.slice(2,-1)).send(msg.content)
        } else {
            if(msg.content.length > 0) {
                guild.members.cache.get(msg.channel.name.slice(2,-1)).send(msg.content)
            }
            if(msg.attachments.size > 0){
                guild.members.cache.get(msg.channel.name.slice(2,-1)).send({files: Array.from(msg.attachments.values())})
            }
        }
    }

    if (msg.guild === null) {
        if(forum.threads.cache.find(c => c.name === `<@${msg.author.id}>`)) {
            if(msg.content > 0 && msg.attachments <= 0) {
                forum.threads.cache.find(c => c.name === `<@${msg.author.id}>`).send({content: `<@${msg.author.id}>: ${msg.content}`})
            } else {
                if(msg.content.length > 0) {
                    forum.threads.cache.find(c => c.name === `<@${msg.author.id}>`).send({content: `<@${msg.author.id}>: ${msg.content}`})
                }
                if(msg.attachments.size > 0) {
                    forum.threads.cache.find(c => c.name === `<@${msg.author.id}>`).send({files: Array.from(msg.attachments.values())})
                }
            }
        }
    }
});