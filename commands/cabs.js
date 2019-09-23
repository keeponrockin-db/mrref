'use strict'
const cabsList = require('./../cabs_list.js')
const chrono = require('chrono-node')

/**
* List new entry or update old one on cabs list
*/
module.exports = {
  commandAliases: ['!cabs'],
  canBeChannelRestricted: true,
  uniqueId: 'cabs13857389',
  serverAdminOnly: false,
  shortDescription: 'Add yourself to the cabs list.',
  usageExample: '!cabs steam xrd',
  action (bot, msg, suffix) {
    let results = chrono.parse(suffix)
    let day = results[0].start.knownValues.weekday
    let time = `${results[0].start.knownValues.hour.toString().padStart(2, 0)}:${results[0].start.knownValues.minute.toString().padStart(2, 0)}`
    let note = suffix
    return cabsList.getChannel(msg.channel.guild).then(channel => {
      return cabsList.updateCabs(msg.channel, msg.author, day, time, note).then(() => {
        return msg.channel.createMessage(channel.mention + ' updated!').then(response => {
          setTimeout(() => {
            msg.channel.deleteMessage(response.id)
          }, 10000)
        })
      })
    })
  }
}
