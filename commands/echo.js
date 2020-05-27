index = require('../index')

module.exports = {
    name: 'echo',
    aliases: ['echo'],
    description: 'Server Statistics',
    execute: function (msg, args) {
        let message;
        if(msg.member.hasPermission("MANAGE_GUILD")) {
            let chid = args[0].replace(/[#<>]/g, '')
            let channel = msg.client.channels.cache.get(chid)
            if (args[1] !== 'edit') {
                message = args.splice(1, args.length - 1).join(' ')
                channel.send(message)
            } else {
                message = args.splice(3, args.length - 3).join(' ')
                channel.messages.fetch(args[2]).then(fetchedMessage => {
                    fetchedMessage.edit(message)
                })
            }
        }
    }
}