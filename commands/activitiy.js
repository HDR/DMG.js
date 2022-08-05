module.exports = {
    name: 'activity',
    description: 'Start an embedded activity',
    options: [
        {
            "name": "activity",
            "description": "choose an activity",
            "type": 3,
            "required": true,
            "choices": [
                {
                    "name": "Ask Away",
                    "value": "976052223358406656"
                },
                {
                    "name": "Awkword",
                    "value": "879863881349087252"
                },
                {
                    "name": "Betrayal.io",
                    "value": "773336526917861400"
                },
                {
                    "name": "Blazing 8s",
                    "value": "832025144389533716"
                },
                {
                    "name": "Bobble League",
                    "value": "947957217959759964"
                },
                {
                    "name": "Checkers In The Park",
                    "value": "832013003968348200"
                },
                {
                    "name": "Chess In The Park",
                    "value": "832012774040141894"
                },
                {
                    "name": "Doodle Crew",
                    "value": "878067389634314250"
                },
                {
                    "name": "Fishington.io",
                    "value": "814288819477020702"
                },
                {
                    "name": "Know What I Meme",
                    "value": "950505761862189096"
                },
                {
                    "name": "Land-io",
                    "value": "903769130790969345"
                },
                {
                    "name": "Letter League",
                    "value": "879863686565621790"
                },
                {
                    "name": "Poker Night",
                    "value": "755827207812677713"
                },
                {
                    "name": "Putt Party",
                    "value": "945737671223947305"
                },
                {
                    "name": "Sketch Heads",
                    "value": "902271654783242291"
                },
                {
                    "name": "Sketchy Artist",
                    "value": "879864070101172255"
                },
                {
                    "name": "SpellCast",
                    "value": "852509694341283871"
                },
                {
                    "name": "Watch Together(New)",
                    "value": "880218394199220334"
                },
                {
                    "name": "Word Snacks",
                    "value": "879863976006127627"
                },
                {
                    "name": "YouTube Together(Old)",
                    "value": "755600276941176913"
                }
            ]
        }
    ],
    execute: async function (interaction) {

        let user = await interaction.member.fetch();
        if (user.voice.channel) {
            interaction.member.voice.channel.createInvite({maxAge: 3600, targetType: 2, targetApplication: interaction.options.get('activity').value}).then(reply => {
                interaction.reply({content: `[Click to open ${reply.targetApplication.name} in ${reply.channel.name}](<https://discord.gg/${reply.code}>)`});
            });
        } else {
            interaction.reply({content: `You have to be in a voice channel to use this command`, ephemeral: true});
        }
    },
}