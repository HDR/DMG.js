const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { stringSimilarity } = require('string-similarity-js')
const sqlite3 = require("sqlite3");
const { token } = require('../config.json')
const { getAudioDurationInSeconds } = require('get-audio-duration')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg');
const wavDecoder = require("wav-decoder");
const fs = require('fs');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Audio Quiz')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Target text channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('answer')
                .setDescription('Set the quiz answer')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('ogg-file')
                .setDescription('OGG file to embed')
                .setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    execute: async function (interaction) {
        await interaction.deferReply({ephemeral: true})
        let db = new sqlite3.Database('./quiz.db', (err) => {if (err) {console.log(err.message);}});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS quiz (quiz_id text, answer text)`).run().finalize();});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS scoreboard (userid text UNIQUE, score text, hint text, solved text)`).run().finalize();});

        const navigators = new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setCustomId('quiz.guess').setLabel('Guess').setStyle('Success').setEmoji('🙋'))
            .addComponents(new ButtonBuilder().setCustomId('quiz.hint').setLabel('Hint').setStyle('Primary').setEmoji('❔'))

        const Embed = new EmbedBuilder();
        Embed.setColor('#FCBA03');
        Embed.setTitle("Quiz Time!");
        Embed.setURL(`https://${interaction.id}.id`)
        Embed.setThumbnail("https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png")
        Embed.setDescription('Guess what GB, GBC or GBA game the sound clip belongs to and score points!')
        Embed.setFooter({text: `Expires`})
        Embed.setTimestamp(Date.now() + 4.32e+7)

        let Channel = interaction.options.getChannel('channel')
        db.run(`INSERT INTO "quiz"(quiz_id, answer) VALUES($quiz_id, $answer)`, [interaction.id, interaction.options.getString('answer')], function (err) {
            if (err) {
                return console.log(`Join ${err.message}`)
            }
        })
        db.close()


        getAudioDurationInSeconds(interaction.options.getAttachment('ogg-file').attachment).then(async (duration) => {
            resetHints()
            let attachment = interaction.options.getAttachment('ogg-file')
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
                    url: interaction.options.getAttachment('ogg-file').attachment,
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
                            await console.log(waveform)
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
                            }).then(async function(){
                                await Channel.send({embeds: [Embed], components: [navigators]})
                                interaction.editReply({ content: `Posted quiz question in ${Channel}`, ephemeral: true})
                            })
                        })
                    })
                })
            })

        })

    },

    guess: async function (interaction) {
        let db = new sqlite3.Database('./quiz.db', (err) => {if (err) {console.log(err.message);}});
        db.run(`INSERT or IGNORE INTO "scoreboard" (userid) VALUES (${interaction.user.id})`, function (err) {
            if (err) {
                return console.log(`Join ${err.message}`)
            }
        })
        db.close()

        const Embed = new EmbedBuilder();
        if(Date.now() < Date.parse(interaction.message.embeds[0].timestamp)) {
            if(JSON.parse(await getSolved(interaction.user.id)).includes(interaction.message.embeds[0].url.substring(8).slice(0, -3))){
                const Embed = new EmbedBuilder();
                Embed.setColor('#ec152e');
                Embed.setTitle(`You have already solved this audio quiz`);
                await interaction.reply({ embeds: [Embed], ephemeral: true})
            } else {
                const modal = new ModalBuilder()
                    .setCustomId('quiz.solve_quiz')
                    .setTitle('Solve the audio quiz')

                const solution = new TextInputBuilder()
                    .setCustomId(`solution`)
                    .setLabel('Enter your answer')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(1)
                    .setMaxLength(128)
                    .setRequired(true)

                const row = new ActionRowBuilder().addComponents(solution)

                modal.addComponents(row)
                await interaction.showModal(modal)
            }
        } else {
            Embed.setColor('#ec152e');
            Embed.setTitle(`This Quiz has expired`);
            await interaction.editReply({ embeds: [Embed], ephemeral: true})
        }
    },

    hint: async function (interaction) {
        let db = new sqlite3.Database('./quiz.db', (err) => {if (err) {console.log(err.message);}});
        db.run(`INSERT or IGNORE INTO "scoreboard" (userid) VALUES (${interaction.user.id})`, function (err) {
            if (err) {
                return console.log(`Join ${err.message}`)
            }
        })
        db.close()

        await interaction.deferReply({ephemeral: true})
        let [userScore, usedHint] = await getUserScore(interaction.user.id)
        const Embed = new EmbedBuilder();
        if(usedHint === "1") {
            Embed.setColor('#ec152e');
            Embed.setTitle(`You have already used a hint`);
            await interaction.editReply({ embeds: [Embed], components: [], ephemeral: true})
        } else {
            if(Date.now() < Date.parse(interaction.message.embeds[0].timestamp)) {
                let solved = JSON.parse(await getSolved(interaction.user.id))
                if(solved.includes(interaction.message.embeds[0].url.substring(8).slice(0, -3))) {
                    Embed.setColor('#ec152e');
                    Embed.setTitle(`You have already solved this audio quiz`);
                    await interaction.editReply({ embeds: [Embed], ephemeral: true})
                } else {
                    const navigators = new ActionRowBuilder()
                        .addComponents(new ButtonBuilder().setCustomId('quiz.hintyes').setLabel('Yes').setStyle('Success'))
                        .addComponents(new ButtonBuilder().setCustomId('quiz.hintno').setLabel('No').setStyle('Danger'))
                    Embed.setColor('#b172ff');
                    Embed.setTitle("Hint");
                    Embed.setURL(`https://${interaction.message.embeds[0].url.substring(8).slice(0, -3)}.id`)
                    Embed.setDescription('Are you sure you want a hint? this will reduce your score by half')
                    await interaction.editReply({ embeds: [Embed], components: [navigators], ephemeral: true})
                }
            } else {
                Embed.setColor('#ec152e');
                Embed.setTitle(`This Quiz has expired`);
                await interaction.editReply({ embeds: [Embed], ephemeral: true})
            }
        }

    },

    solve_quiz: async function (interaction) {
        let answer = await getAnswer(interaction.message.embeds[0].url.substring(8).slice(0, -3))
        let [userScore, usedHint] = await getUserScore(interaction.user.id)
        let solved = JSON.parse(await getSolved(interaction.user.id))

        await interaction.deferReply({ephemeral: true})
        const Embed = new EmbedBuilder();
        Embed.setColor('#15abec');

        if (stringSimilarity(interaction.fields.getTextInputValue('solution').toLowerCase(), answer.toLowerCase()) >= 0.65) {
            let newScore = 10
            if (parseInt(usedHint) === 1) {
                newScore = 5
            }

            Embed.setTitle("Congratulations! you guessed correctly");
            Embed.setURL(`https://${interaction.message.embeds[0].url.substring(8).slice(0, -3)}.id`)
            Embed.setDescription(`You scored ${newScore} point(s)`)
            Embed.addFields({
                name: 'New points total',
                value: `${newScore+parseInt(userScore)}`
            })


            solved.push(`${interaction.message.embeds[0].url.substring(8).slice(0, -3)}`)
            let db = new sqlite3.Database('./quiz.db', (err) => {if (err) {console.log(err.message);}});
            db.run(`UPDATE "scoreboard" SET score="${newScore + parseInt(userScore)}", hint="0", solved='${JSON.stringify(solved)}' WHERE userid=${interaction.user.id}`, function (err) {
                if (err) {
                    return console.log(`Join ${err.message}`)
                }
            })
        } else {
            Embed.setTitle("Sorry! you guessed incorrectly");
            Embed.setDescription(`You have not scored any points, please try again!`)
        }

        await interaction.editReply({embeds: [Embed], components: [], ephemeral: true})

    },

    reveal: async function(interaction) {

    },

    hintyes: async function (interaction) {
        let answer = await getAnswer(interaction.message.embeds[0].url.substring(8).slice(0, -3))
        let db = new sqlite3.Database('./quiz.db', (err) => {if (err) {console.log(err.message);}});
        db.run(`UPDATE "scoreboard" SET hint="1" WHERE userid=${interaction.user.id}`, function (err) {
            if (err) {
                return console.log(`Join ${err.message}`)
            }
        })
        db.close()

        let hint = `\`${answer.replace(/\S/g, "_")}\``
        let hintObj = {}

        for(let i = 0; i < Math.floor((30 / 100) * answer.length); i++){
            let pickRandom = Math.floor(Math.random() * answer.length)
            if(answer[pickRandom] !== ' ') {
                if(!Object.values(hintObj).includes(pickRandom+1)) {
                    hintObj[i] = pickRandom+1
                    hint = hint.split('');
                    hint[pickRandom+1] = answer[pickRandom];
                    hint = hint.join('');
                } else {
                    i--;
                }
            } else {
                i--;
            }
        }

        const Embed = new EmbedBuilder();
        Embed.setColor('#7515ec');
        Embed.setTitle(`Revealed ${Math.floor((30 / 100) * answer.length)} letter(s)`);
        Embed.setURL(`https://${interaction.message.embeds[0].url.substring(8).slice(0, -3)}.id`)
        Embed.setDescription('Your score was reduced by half')
        Embed.addFields({
            name: 'Hint',
            value: `${hint}`
        })
        await interaction.deferUpdate()
        await interaction.editReply({ embeds: [Embed], components: [], ephemeral: true})
    },

    hintno: async function (interaction) {
        const Embed = new EmbedBuilder();
        Embed.setColor('#7515ec');
        Embed.setTitle("No hint provided");
        Embed.setURL(`https://${interaction.message.embeds[0].url.substring(8).slice(0, -3)}.id`)
        Embed.setDescription('Your points were not reduced')
        await interaction.deferUpdate()
        await interaction.editReply({ embeds: [Embed], components: [], ephemeral: true})
    }
}

async function getAnswer(quiz_id) {
    let db = new sqlite3.Database('./quiz.db', sqlite3.OPEN_READONLY ,(err) => {if (err) {console.log(err.message);}});
    return new Promise((resolve, reject) => {
         db.serialize(() => {
            db.all(`SELECT * FROM "quiz"`, async (err, val) => {
                if(val.length === 0) {resolve(["0","0"])}
                for (const [key, value] of Object.entries(val)) {
                    if(value.quiz_id === quiz_id) {
                        resolve(value.answer)
                    }
                }
            })
        })
    })
}

async function getUserScore(user_id) {
    let db = new sqlite3.Database('./quiz.db', sqlite3.OPEN_READONLY ,(err) => {if (err) {console.log(err.message);}});
    return new Promise((resolve, reject) => {
         db.serialize(() => {
            db.all(`SELECT * FROM "scoreboard"`, (err, val) => {
                if(val.length === 0) {resolve(["0","0"])}
                for(const [key, value] of Object.entries(val)) {
                    if(user_id === value.userid) {
                        if(value.score === null){value.score="0"}
                        resolve([value.score, value.hint])
                    }
                }
            })
        })
    })
}

async function getSolved(user_id) {
    let db = new sqlite3.Database('./quiz.db', sqlite3.OPEN_READONLY ,(err) => {if (err) {console.log(err.message);}});
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`SELECT * FROM "scoreboard"`, (err, val) => {
                if(val.length === 0) {resolve("[]")}
                for(const [key, value] of Object.entries(val)) {
                    if(user_id === value.userid) {
                        if(!value.solved) {resolve("[]")}
                        resolve(value.solved)
                    }
                }
            })
        })
    })
}

async function resetHints() {
    let db = new sqlite3.Database('./quiz.db', (err) => {if (err) {console.log(err.message);}});
    return new Promise((resolve, reject) => {
        db.run(`UPDATE "scoreboard" SET hint="0"`, function (err) {
            if (err) {
                resolve(false)
            }
        })
        db.close()
        resolve(true)
    })
}

function extractPCM(inputFile, outputFile, callback) {
    if(Buffer.isBuffer(inputFile)) {
        fs.writeFileSync('temp.ogg', inputFile);
        inputFile = 'temp.ogg';
    }

    ffmpeg(inputFile)
        .output(outputFile)
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
        extractPCM(opusFile, "temp.wav", async (wavFile) => {
            try {
                const buffer = fs.readFileSync(wavFile);
                const decodedWav = await wavDecoder.decode(buffer);

                let samples = decodedWav.channelData[0];
                let step = Math.floor(samples.length / 256);
                let waveform = [];

                for (let i = 0; i < 256; i++) {
                    let slice = samples.slice(i * step, (i + 1) * step);
                    let peak = Math.max(...slice.map(s => Math.abs(s)));
                    waveform.push(Math.round(peak * 255));
                }

                fs.unlink('temp.ogg', () => {
                    fs.unlink('temp.wav', () => {
                        resolve(Buffer.from(waveform).toString('base64'));
                    })
                })
            } catch (err) {
                reject(err);
            }
        })
    })
}