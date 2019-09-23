'use strict'
const botVersion = require('../package.json').version

module.exports = {
  commandAliases: ['bot!about'],
  uniqueId: 'about53463',
  cooldown: 5,
  shortDescription: 'Show some meta information about me.',
  action (bot, msg, suffix) {
    return msg.channel.createMessage(`\`\`\`md
# monochrome

[ CREATOR ](You)
[ VERSION ](Bot v${botVersion})\`\`\``)
  }
}
