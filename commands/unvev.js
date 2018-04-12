'use strict'
const vevList = require('./../vev_list.js')

module.exports = {
  commandAliases: ['!unvev'],
  canBeChannelRestricted: true,
  uniqueId: 'unvev66666666',
  serverAdminOnly: false,
  shortDescription: 'you\'re all free now',
  usageExample: '!unvev @innocentman',
  action (bot, msg, suffix) {
    let re = /.*<@!?(.*?)>.*/i
    let results = suffix.match(re)

    if (!results) {
      return msg.channel.createMessage('Invalid id')
    }

    let userId = results[1]
    vevList.unvev(userId, msg.channel, msg.author.id).then(success => {
      if (success) {
        return msg.channel.createMessage('Unvev\'d')
      } else {
        return msg.channel.createMessage('You don\'t have enough points for this unvev!')
      }
    })
  }
}
