module.exports = {
    name: 'edit',
    aliases: ['edit'],
    description: 'Edit a message as the bot',
    execute: function (msg, args) {
        let message;
        if(msg.member.hasPermission("MANAGE_GUILD")) {
            let splitstr = args[0].toString().split('/')
            let channel = msg.client.channels.cache.get(splitstr[5])
            message = args.splice(1, args.length - 1).join(' ')
            channel.messages.fetch(splitstr[6]).then(msg => {
                msg.edit(message)
            })
        }
    }
}