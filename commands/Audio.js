const {SlashCommandBuilder, PermissionFlagsBits, MessageFlags, ChannelType, PermissionsBitField} = require("discord.js");
const { token } = require('../config.json')
const { getAudioDurationInSeconds } = require('get-audio-duration')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg');
const wavDecoder = require("wav-decoder");
const crypto = require("crypto");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('audio')
        .setDescription('Send an Audio Message')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Target text channel')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('opus-ogg-file')
                .setDescription('OPUS OGG file to embed')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    execute: async function (interaction) {
        await interaction.deferReply({flags: MessageFlags.Ephemeral})
        let Channel = interaction.options.getChannel('channel')

        if (Channel.permissionsFor(await interaction.guild.members.me).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles])) {
            getAudioDurationInSeconds(interaction.options.getAttachment('opus-ogg-file').attachment).then(async (duration) => {
                let attachment = interaction.options.getAttachment('opus-ogg-file')
                if(attachment.name.endsWith('.ogg')) {
                    await axios({
                        method: 'POST',
                        url: `https://discord.com/api/v10/channels/${Channel.id}/attachments`,
                        data: {
                            files: [
                                {
                                    "filename": "voice-message.ogg",
                                    "file_size": attachment.size,
                                    "id": 2
                                }
                            ]
                        },
                        headers: {'Content-Type': 'application/json', 'Authorization': `Bot ${token}`
                        },
                    }).then(async function (res) {
                        await axios({
                            method: "GET",
                            url: interaction.options.getAttachment('opus-ogg-file').attachment,
                            responseType: "arraybuffer"
                        }).then(async function (re1) {
                            let {upload_url, upload_filename} = res.data.attachments[0]
                            await generateWaveform(re1.data).then(async (waveform) => {
                                await axios({
                                    method: "PUT",
                                    url: upload_url,
                                    headers: {'Content-Type': 'application/json', 'Authorization': `Bot ${token}`},
                                    data: re1.data
                                }).then(async function (re2) {
                                    await Channel.send({
                                        flags: 8192,
                                        attachments: [
                                            {
                                                id: "0",
                                                filename: "voice-message.ogg",
                                                uploaded_filename: `${upload_filename}`,
                                                duration_secs: duration,
                                                waveform: waveform
                                            }
                                        ],
                                    })
                                    interaction.editReply({ content: `Posted audio message in ${Channel}`, flags: MessageFlags.Ephemeral})
                                })
                            })
                        })
                    })
                } else {
                    interaction.editReply({ content: `The file you uploaded is not an .ogg file`, flags: MessageFlags.Ephemeral})
                }
            })
        } else {
            interaction.editReply({ content: `Bot is missing SendMessage or AttachFiles Permission`, flags: MessageFlags.Ephemeral})
        }
    }
}

function extractPCM(inputFile, outputFile, callback) {
    if(Buffer.isBuffer(inputFile)) {
        fs.writeFileSync(`${outputFile}.ogg`, inputFile);
        inputFile = `${outputFile}.ogg`;
    }

    ffmpeg(inputFile)
        .output(`${outputFile}.wav`)
        .audioCodec('pcm_s16le')
        .audioFrequency(48000)
        .audioChannels(1)
        .format('wav')
        .on('end', () => callback(outputFile))
        .on('error', (err) => console.error('FFmpeg Error:', err))
        .run();
}

async function generateWaveform(opusFile) {
    return new Promise((resolve, reject) => {

        const tempFile = `temp-${crypto.randomBytes(8).toString('hex')}`;

        extractPCM(opusFile, tempFile, async (wavFile) => {
            try {
                const buffer = fs.readFileSync(`${wavFile}.wav`);
                const decodedWav = await wavDecoder.decode(buffer);

                let samples = decodedWav.channelData[0];
                let step = Math.floor(samples.length / 256);
                let waveform = [];

                for (let i = 0; i < 256; i++) {
                    let slice = samples.slice(i * step, (i + 1) * step);
                    let peak = Math.max(...slice.map(s => Math.abs(s)));
                    waveform.push(Math.round(peak * 255));
                }

                fs.unlink(`${tempFile}.ogg`, () => {
                    fs.unlink(`${tempFile}.wav`, () => {
                        resolve(Buffer.from(waveform).toString('base64'));
                    })
                })
            } catch (err) {
                reject(err);
            }
        })
    })
}