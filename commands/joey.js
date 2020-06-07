function generateKey(hex1, hex2, hex3) {
    let res = ((hex1 ^ 0x4210005) >>> 5 | (hex1 ^ 0x4210005) << 0x1b) ^ ((hex2 ^ 0x30041523) >>> 3 | (hex2 ^ 0x30041523) << 0x1d) ^ ((hex3 ^ 0x6517bebe) >>> 0xc | (hex3 ^ 0x6517bebe) << 0x14);
    for(let i = 0; i < 100; i++){res = res >>> 1 | (res ^ res >>> 0x1f ^ (res & 0x200000) >>> 0x15 ^ (res & 2) >>> 1 ^ res & 1) << 0x1f}
    return res.toString(16);
}
module.exports = {
    name: 'joey',
    aliases: ['joeykey', 'updatekey'],
    description: 'Lets you get your Joey Gen3 Update Key',
    execute: function (msg, args) {
        if (args[0].length !== 0 && args[1].length !== 0 && args[2].length !== 0){msg.channel.send(`Your update key is: ${generateKey(args[0],args[1],args[2])}`)}
    }
}