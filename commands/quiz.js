const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, ContainerBuilder, MessageFlags, ComponentType,
    EmbedBuilder
} = require("discord.js");
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
                .addChannelTypes(ChannelType.GuildText)
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
        await interaction.deferReply({flags: MessageFlags.Ephemeral})
        let db = new sqlite3.Database('./quiz.db', (err) => {if (err) {console.log(err.message);}});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS quiz (quiz_id text, answer text)`).run().finalize();});
        db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS scoreboard (userid text UNIQUE, score text, hint text, solved text)`).run().finalize();})

        const container = {
                "type": 17,
                "accent_color": 16562691,
                "components": [
                    {
                        "type": 9,
                        "accessory": {
                            "type": 11,
                            "media": {
                                "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                            },
                            "description": interaction.id
                        },
                        "components": [
                            {
                                "type": 10,
                                "content": `# Quiz Time\n-# Expires • <t:${Math.floor(Date.now() / 1000 + 43200)}:R>\n**Guess which GB, GBC or GBA game the sound clip belongs to and score points!**`
                            }
                        ]
                    },
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 2,
                                "style": 3,
                                "label": "Guess",
                                "emoji": { "name": "🙋" },
                                "custom_id": "quiz.guess"
                            },
                            {
                                "type": 2,
                                "style": 1,
                                "label": "Hint",
                                "emoji": { "name": "❔" },
                                "custom_id": "quiz.hint"
                            },
                            {
                                "type": 2,
                                "style": 2,
                                "label": "Leaderboard",
                                "emoji": { "name": "🥇" },
                                "custom_id": "quiz.leaderboard"
                            }
                        ]
                    }
                ]
        }

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
                                components: []
                            }).then(async function(){
                                await Channel.send({flags: MessageFlags.IsComponentsV2, components: [container]})
                                interaction.editReply({ content: `Posted quiz question in ${Channel}`, flags: MessageFlags.Ephemeral})
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

        let quizId = interaction.message.components[0].components[0].accessory.data.description
        let timestamp = interaction.message.components[0].components[0].components[0].content
        let match = timestamp.match(/<t:(\d+):R>/)
        let solveContainer = {}

        if(Date.now() < new Date(parseInt(match[1], 10)* 1000)) {
            if(JSON.parse(await getSolved(interaction.user.id)).includes(quizId)){
                solveContainer = {
                    "type": 17,
                    "accent_color": 15471918,
                    "components": [
                        {
                            "type": 9,
                            "accessory": {
                                "type": 11,
                                "media": {
                                    "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                                },
                            },
                            "components": [
                                {
                                    "type": 10,
                                    "content": "# You have already solved this quiz\n-# No double dipping!"
                                }
                            ]
                        }
                    ]
                }
                await interaction.deferReply({flags: MessageFlags.Ephemeral})
                await interaction.editReply({ components: [solveContainer], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
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
            solveContainer = {
                "type": 17,
                "accent_color": 15471918,
                "components": [
                    {
                        "type": 9,
                        "accessory": {
                            "type": 11,
                            "media": {
                                "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                            },
                        },
                        "components": [
                            {
                                "type": 10,
                                "content": "# This Quiz has expired\n-# You would need a time machine to solve this one."
                            }
                        ]
                    }
                ]
            }
            await interaction.editReply({ components: [solveContainer], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
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

        let hintContainer = {}

        await interaction.deferReply({flags: MessageFlags.Ephemeral})
        let [userScore, usedHint] = await getUserScore(interaction.user.id)
        if(usedHint === "1") {
            hintContainer = {
                "type": 17,
                "accent_color": 15471918,
                "components": [
                    {
                        "type": 9,
                        "accessory": {
                            "type": 11,
                            "media": {
                                "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                            },
                        },
                        "components": [
                            {
                                "type": 10,
                                "content": "# You have already used a hint\n-# Hints are limited to 1 per quiz"
                            }
                        ]
                    }
                ]
            }
        } else {
            let quizId = interaction.message.components[0].components[0].accessory.data.description
            let timestamp = interaction.message.components[0].components[0].components[0].content
            let match = timestamp.match(/<t:(\d+):R>/)
            if(Date.now() < new Date(parseInt(match[1], 10)* 1000)) {
                let solved = JSON.parse(await getSolved(interaction.user.id))
                if(solved.includes(quizId)) {
                    hintContainer = {
                        "type": 17,
                        "accent_color": 15471918,
                        "components": [
                            {
                                "type": 9,
                                "accessory": {
                                    "type": 11,
                                    "media": {
                                        "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                                    },
                                },
                                "components": [
                                    {
                                        "type": 10,
                                        "content": "# You have already solved this quiz\n-# No double dipping!"
                                    }
                                ]
                            }
                        ]
                    }
                } else {
                    hintContainer = {
                        "type": 17,
                        "accent_color": 11629311,
                        "components": [
                            {
                                "type": 9,
                                "accessory": {
                                    "type": 11,
                                    "media": {
                                        "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                                    },
                                    "description": `${quizId}`,
                                },
                                "components": [
                                    {
                                        "type": 10,
                                        "content": "## Hint\n**Are you sure you want to use a hint?**\n-# Using a hint will cut your score in half"
                                    }
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    {
                                        "type": 2,
                                        "style": 3,
                                        "label": "Yes",
                                        "custom_id": "quiz.hintyes"
                                    },
                                    {
                                        "type": 2,
                                        "style": 4,
                                        "label": "No",
                                        "custom_id": "quiz.hintno"
                                    }
                                ]
                            }
                        ]
                    }
                }
            } else {
                hintContainer = {
                    "type": 17,
                    "accent_color": 15471918,
                    "components": [
                        {
                            "type": 9,
                            "accessory": {
                                "type": 11,
                                "media": {
                                    "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                                },
                            },
                            "components": [
                                {
                                    "type": 10,
                                    "content": "# This Quiz has expired\n-# You would need a time machine to solve this one."
                                }
                            ]
                        }
                    ]
                }
            }
        }
        await interaction.editReply({components: [hintContainer], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})

    },

    solve_quiz: async function (interaction) {
        let quizId = interaction.message.components[0].components[0].accessory.data.description
        let answer = await getAnswer(quizId)
        let [userScore, usedHint] = await getUserScore(interaction.user.id)
        let solved = JSON.parse(await getSolved(interaction.user.id))

        await interaction.deferReply({flags: MessageFlags.Ephemeral})
        let scoreContainer = {}

        if (stringSimilarity(interaction.fields.getTextInputValue('solution').toLowerCase(), answer.toLowerCase()) >= 0.65) {
            let newScore = 10
            if (parseInt(usedHint) === 1) {
                newScore = 5
            }

            scoreContainer = {
                "type": 17,
                "accent_color": 1420268,
                "components": [
                    {
                        "type": 9,
                        "accessory": {
                            "type": 11,
                            "media": {
                                "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                            },
                        },
                        "components": [
                            {
                                "type": 10,
                                "content": `# Congratulations!\nYou guessed correctly and scored **${newScore}** points`
                            },
                            {
                                "type": 10,
                                "content": `## New Points Total: **${newScore+parseInt(userScore)}**`
                            }
                        ]
                    },
                ]
            }


            solved.push(`${quizId}`)
            let db = new sqlite3.Database('./quiz.db', (err) => {if (err) {console.log(err.message);}});
            db.run(`UPDATE "scoreboard" SET score="${newScore + parseInt(userScore)}", hint="0", solved='${JSON.stringify(solved)}' WHERE userid=${interaction.user.id}`, function (err) {
                if (err) {
                    return console.log(`Join ${err.message}`)
                }
            })
        } else
            scoreContainer = {
                "type": 17,
                "accent_color": 15471918,
                "spoiler": false,
                "components": [
                    {
                        "type": 10,
                        "content": "# Sorry!"
                    },
                    {
                        "type": 10,
                        "content": "You guessed incorrectly and did not score any points"
                    }
                ]
        }

        await interaction.editReply({components: [scoreContainer], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})

    },

    reveal: async function(interaction) {

    },

    hintyes: async function (interaction) {
        let quizId = interaction.message.components[0].components[0].accessory.data.description
        let answer = await getAnswer(quizId)
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

        const hintYesContainer = {
            "type": 17,
            "accent_color": 7673324,
            "components": [
                {
                    "type": 9,
                    "accessory": {
                        "type": 11,
                        "media": {
                            "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                        },
                    },
                    "components": [
                        {
                            "type": 10,
                            "content": `# Revealed ${Math.floor((30 / 100) * answer.length)} letter(s)\n-# Your awarded score for solving the quiz will be cut in half`
                        },
                        {
                            "type": 10,
                            "content": `## Hint: ${hint}`
                        }
                    ]
                }
            ]
        }
        await interaction.deferUpdate()
        await interaction.editReply({components: [hintYesContainer], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
    },

    hintno: async function (interaction) {
        const noHintContainer = {
            "type": 17,
            "accent_color": 7673324,
            "components": [
                {
                    "type": 9,
                    "accessory": {
                        "type": 11,
                        "media": {
                            "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                        },
                    },
                    "components": [
                        {
                            "type": 10,
                            "content": "# No hint provided\nYour points have not been reduced"
                        }
                    ]
                },
            ]
        }
        await interaction.deferUpdate()
        await interaction.editReply({components: [noHintContainer], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
    },

    leaderboard: async function(interaction) {
        let db = new sqlite3.Database('./quiz.db', sqlite3.OPEN_READONLY ,(err) => {if (err) {console.log(err.message);}});
        return new Promise(async(resolve, reject) => {
            db.serialize(async() => {
                db.all(`SELECT * FROM "scoreboard" order by cast(score AS  INTEGER) DESC limit 10`, async (err, val) => {
                    let topTen = ''
                    for(const [key, value] of Object.entries(val)) {
                        if(interaction.guild.members.cache.get(value.userid)) {
                            if(value.score !== null) {
                                topTen += `**${interaction.guild.members.cache.get(value.userid).user.globalName}**\nScore: **${value.score}**\n`
                            }
                        }
                        if(parseInt(key)+1 === Object.entries(val).length) {
                            const leaderboardContainer = {
                                "type": 17,
                                "accent_color": 1436851,
                                "components": [
                                    {
                                        "type": 9,
                                        "accessory": {
                                            "type": 11,
                                            "media": {
                                                "url": "https://martinrefseth.com/gameboy/assets/discord/DMG_512x512_Green_Quiz.png"
                                            },
                                        },
                                        "components": [
                                            {
                                                "type": 10,
                                                "content": "# Audio Quiz Leaderboard\n-# Top 10 Scores"
                                            },
                                            {
                                                "type": 10,
                                                "content": `${topTen}`
                                            }
                                        ]
                                    }
                                ]
                            }
                            await interaction.deferReply({flags: MessageFlags.Ephemeral})
                            await interaction.editReply({components: [leaderboardContainer], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
                        }
                    }
                })
            })
        })
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