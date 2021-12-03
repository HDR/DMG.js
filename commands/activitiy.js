module.exports = {
    name: 'activity',
    description: 'Start an activity',
    options: [
        {
            "name": "activity",
            "description": "choose an activity",
            "type": 3,
            "required": true,
            "choices": [
                {
                    "name": "Awkword",
                    "value": "879863881349087252"
                },
                {
                    "name": "Betrayal.io",
                    "value": "773336526917861400"
                },
                {
                    "name": "Checkers in the park",
                    "value": "832013003968348200"
                },
                {
                    "name": "Chess in the park",
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
                    "name": "Letter Tile",
                    "value": "879863686565621790"
                },
                {
                    "name": "Poker Night",
                    "value": "755827207812677713"
                },
                {
                    "name": "Spellcast",
                    "value": "852509694341283871"
                },
                {
                    "name": "Watch together",
                    "value": "880218394199220334"
                },
                {
                    "name": "Word Snacks",
                    "value": "879863976006127627"
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