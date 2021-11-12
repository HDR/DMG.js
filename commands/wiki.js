const Discord = require("discord.js");

module.exports = {
    name: 'wiki',
    description: 'Links to the official Game Boy Discord wiki',
    options: [
        {
            "name": "newuser",
            "description": "Link the new user guide",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "resources",
            "description": "Link the resources",
            "type": 'SUB_COMMAND'
        },
        {
            "name": "backlight",
            "description": "Link makho's backlight notes",
            "type": 'SUB_COMMAND'
        }
    ],
    execute: function (interaction) {

        const Embed = new Discord.MessageEmbed();
        Embed.setColor('#00aaaa');
        switch(interaction.options._subcommand.toString()){

            case 'newuser':
                Embed.setTitle("Wiki - New User Guide");
                Embed.setDescription("Please read the New User Guide, it will most likely answer a lot of your questions")
                Embed.setThumbnail("https://gameboy.github.io/assets/images/site/logo.png")
                Embed.setURL("https://gameboy.github.io/wiki/newusers")
                interaction.reply({ embeds: [Embed] });
                break;

            case 'resources':
                Embed.setTitle("Wiki - Resources");
                Embed.setDescription("Looking for something specific? please check the resources page!")
                Embed.setThumbnail("https://gameboy.github.io/assets/images/site/logo.png")
                Embed.setURL("https://gameboy.github.io/wiki/resources")
                interaction.reply({ embeds: [Embed] });
                break;

            case 'backlight':
                Embed.setTitle("Wiki - Backlight Notes");
                Embed.setDescription("Need info on backlight mods? make sure you read makho's backlight notes!")
                Embed.setThumbnail("https://gameboy.github.io/assets/images/site/logo.png")
                Embed.setURL("https://gameboy.github.io/wiki/backlightmods")
                interaction.reply({ embeds: [Embed] });
                break;
        }
    }
}