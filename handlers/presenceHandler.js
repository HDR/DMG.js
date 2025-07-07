const {client} = require("../constants");
const { ActivityType } = require('discord.js');
const cron = require("node-cron");
const moment = require("moment");


client.on('ready', async msg => {
    await updateStats()
    cron.schedule('*/5 * * * *', () => {
        updateStats()
    })
});

async function updateStats() {
    await client.user.setPresence({ activities: [{ name: 'The Game Boy Discord', type: ActivityType.Watching, state: `Uptime: ${moment.duration(client.uptime).humanize()}`}], status: 'online'});
}