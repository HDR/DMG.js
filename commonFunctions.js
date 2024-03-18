const { dm_channel } = require('./config.json')
const sqlite3 = require("sqlite3");
const _ = require("lodash");

module.exports = {
    sendPM: function (user, message){
        user.send({content: `${message}`}).catch(error => {
            if(user.guild) {
                user.guild.channels.cache.get(dm_channel).send({content: `<@${user.id}> ${message} (This message was posted in public chat as i could not pm you)`});
            }
        });
    },

    warn: function (user, reason, warned_by, silent){
    let db = new sqlite3.Database('./dmg.db', (err) => {if (err) {console.log(err.message);}});
    db.serialize(() => {db.prepare(`CREATE TABLE IF NOT EXISTS warnings (User text, WarningMessage text, WarnedBy text, Date text)`).run().finalize();});
    db.run('INSERT INTO "warnings"(User, WarningMessage, WarnedBy, Date) VALUES($User, $WarningMessage, $WarnedBy, $Date)', [user.id, reason, warned_by, Date.now()], function (err) {
        if (err) {
            return console.log(`Join ${err.message}`)
        } else {
            if(!silent) {
                module.exports.sendPM(user, `You have been warned in the Game Boy Discord with the following warning: \`${reason}\``);
            }
        }
    })
    db.close()
    },

    getObjectDiff: function (object1, object2, compareRef = false) {
        return Object.keys(object1).reduce((result, key) => {
            if(!object2.hasOwnProperty(key)) {
                result.push(key);
            } else if (_.isEqual(object1[key], object2[key])) {
                const resultKeyIndex = result.indexOf(key);

                if(compareRef && object1[key] !== object2[key]) {
                    result[resultKeyIndex] = `${key} (ref)`;
                } else {
                    result.splice(resultKeyIndex, 1);
                }
            }
            return result
        }, Object.keys(object2));
    }
}



