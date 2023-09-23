const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Search for wiki pages')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Search Query')
                .setRequired(true)
                .setAutocomplete(true)),

    async autocomplete(interaction){
        const focus = interaction.options.getFocused(true);

        fetch('https://gbwiki.org/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                {
                    pages {
                        search(query: "${interaction.options.getString('query')}") {
                            totalHits
                            results {
                                id
                                title
                                description
                                path
                                locale
                            }
                            suggestions
                        }
                    }
                }
                `
            })
        }).then((res) => res.json())
            .then(async (result) => {
                let choices = []
                for(let i = 0; i < result.data.pages.search.results.length; i++){
                    choices.push(`${result.data.pages.search.results[i].title}|${result.data.pages.search.results[i].description}|${result.data.pages.search.results[i].path}`)
                }
                const filtered = choices.filter(choice => choice.includes(focus.value));
                let options
                if (filtered.length > 25) {
                    options = filtered.slice(0, 25);
                } else {
                    options = filtered
                }

                await interaction.respond(options.map(choice => ({name: choice.split("|")[0], value: `${choice.split('|')[0]}|${choice.split('|')[1].substring(0,50)}|${choice.split('|')[2]}`})))
            })


    },

    async execute(interaction) {
        let result = interaction.options.getString('query').split("|")
        const Embed = new EmbedBuilder();
        let description = result[1];
        if(result[1].length === 0) {
            description = 'None'
        }
        Embed.setColor('#7bfdd6')
            .setTitle(`GBWiki: ${result[0]}`)
            .setDescription(`Description: ${description}...`)
            .setImage('https://gameboy.github.io/assets/images/site/logo.png')
            .setURL(`https://gbwiki.org/${result[2]}`)
            .setFooter({text:`https://gbwiki.org/${result[2]}`})
        interaction.reply({embeds: [Embed]})
    },
}