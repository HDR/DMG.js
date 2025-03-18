const { client } = require("../constants");
const { Events, ChannelType, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const { troubleshooting_channel } = require("./config/troubleshootingHandler.json");

client.on(Events.MessageCreate, async msg => {
    if(msg.channel.type === ChannelType.PublicThread && msg.channel.parentId === troubleshooting_channel) {
        if(await msg.channel.fetchStarterMessage() === msg){
            const tagWikiMap = {
                'Game Boy Advance': 'https://gbwiki.org/en/consoles/advance',
                'Game Boy Advance SP': 'https://gbwiki.org/en/consoles/advancesp',
                'Game Boy': 'https://gbwiki.org/en/consoles/gameboy',
                'Game Boy Color': 'https://gbwiki.org/en/consoles/color',
                'Game Boy Micro': 'https://gbwiki.org/en/consoles/micro',
                'Game Boy Pocket': 'https://gbwiki.org/en/consoles/pocket',
                'Game Boy Light': 'https://gbwiki.org/en/consoles/light',
                'Game Cartridge': 'https://gbwiki.org/en/other/commonissues#game-cartridge-problems',
            };
            let tag = msg.channel.appliedTags.map(s => msg.channel.parent.availableTags.find(t => t.id === s)).map(x => x.name)[0];
            let wikiString = "Please remember to provide as much information as possible including all troubleshooting steps you have already taken. If this is a hardware issue, please provide clear in-focus images of the issue, PCB (circuit board), installation, and any soldering you have done. Help us help you, posts with insufficient information will be deleted\n\n";
            wikiString += tagWikiMap[tag] ? `Because this post has the "${tag}" tag, we recommend checking out this wiki page ${tagWikiMap[tag]}` : 'We also recommend checking the wiki https://gbwiki.org/';
            wikiString += `\n\nOnce your issue has been resolved, please click the "Solved" button`
            const solved = new ActionRowBuilder()
                .addComponents(new ButtonBuilder().setCustomId('commonFunctions.troubleshootingSolved').setLabel('Solved').setStyle('Success').setEmoji('✅'))
            msg.reply({content: wikiString, components: [solved]})
            msg.channel.setAppliedTags([...msg.channel.appliedTags, '1006399902978408448'])
        }
    }
})