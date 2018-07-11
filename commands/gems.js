'use strict'
const gemsList = require('./../gems_list.js')

/**
* List new entry or update old one on gems list
*/
module.exports = {
  commandAliases: ['!gems'],
  canBeChannelRestricted: true,
  uniqueId: 'gems13857389',
  serverAdminOnly: false,
  shortDescription: 'Add yourself to the gems list.',
  usageExample: '!gems steam xrd',
  action (bot, msg, suffix) {
    let title = suffix
    return gemsList.getChannel(msg.channel.guild).then(channel => {
      return gemsList.updateRoom(msg.channel.guild, msg.author, title).then(() => {
        return msg.channel.createMessage(channel.mention + ' updated!').then(response => {
          if (msg.channel.id === channel.id) {
            setTimeout(() => {
              msg.channel.deleteMessage(msg.id)
              msg.channel.deleteMessage(response.id)
            }, 10000)
          }
        })
      })
    })
  }
}
