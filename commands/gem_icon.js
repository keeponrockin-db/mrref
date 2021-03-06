'use strict'
const gemsList = require('./../gems_list.js')

/**
* Changes platform visual for listed games
*/
module.exports = {
  commandAliases: ['!gemicon'],
  canBeChannelRestricted: true,
  uniqueId: 'gemicon12511137',
  serverAdminOnly: false,
  shortDescription: 'Add icon to the gems list.',
  usageExample: '!gemicon steam https://pbs.twimg.com/profile_images/887778636102721536/Nxgl7xz4.jpg',
  action (bot, msg, suffix) {
    let re = /\s*(.*?)\s+(http.*)/i
    let results = suffix.match(re)

    if (!results) {
      return msg.channel.createMessage('Invalid icon')
    }

    let title = results[1]
    let url = results[2]

    return gemsList.updateIcon(msg.channel.guild, title, url).then(() => {
      return msg.channel.createMessage('Gems icon updated!').then(response => {
        setTimeout(() => {
          msg.channel.deleteMessage(msg.id)
          msg.channel.deleteMessage(response.id)
        }, 10000)
      })
    })
  }
}
