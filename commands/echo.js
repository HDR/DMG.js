module.exports = {
    name: 'echo',
    aliases: ['echo'],
    description: 'Echo a message as the bot',
    options: [
        {
            "name": "channel",
            "description": "Target channel",
            "type": 7,
            "required": true
        },
        {
            "name": "Message",
            "description": "Message Content",
            "type": 3,
            "required": true
        }
    ],
    choices: [],
    execute: function (msg, args) {
        let message;
        if(msg.member.hasPermission("MANAGE_GUILD")) {
            let channelid = args[0].replace(/[#<>]/g, '')
            let channel = msg.client.channels.cache.get(channelid)
            message = args.splice(1, args.length - 1).join(' ')
            channel.send(message)
            }
    }
}