'use strict'
const vevList = require('./../vev_list.js')

module.exports = {
  commandAliases: ['!burstvev'],
  canBeChannelRestricted: true,
  uniqueId: 'burstvev66666666',
  serverAdminOnly: false,
  shortDescription: 'Send dissenters to the gulag',
  usageExample: '!burstvev @criminal',
  action (bot, msg, suffix) {
    let re = /.*<@!?(.*?)>.*/i
    let results = suffix.match(re)

    if (!results) {
      return msg.channel.createMessage('Invalid id')
    }

    let userId = results[1]
    vevList.vev(userId, msg.channel, msg.author.id).then(success => {
      if (success) {
        return msg.channel.createMessage('https://images.discordapp.net/attachments/147129832507965440/338887233090093057/36724208.png').then(response => {
          setTimeout(() => {
            msg.channel.deleteMessage(response.id)
          }, 10000)
        })
      } else {
        return msg.channel.createMessage('You don\'t have enough points for this vev!')
      }
    })
  }
}
