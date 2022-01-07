const stats = require("../commands/stats.js");

module.exports = {
    name: 'Stats',
    type: 'USER',
    defaultPermission: false,

    execute: async function (interaction) {
        await stats.getStats(interaction, true);
    }
}