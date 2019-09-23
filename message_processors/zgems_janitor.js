'use strict'
const gemsList = require('./../gems_list.js')

/**
* Adds bot uploaded comics to an archive
*/
module.exports = {
  name: 'gemsjanitor',
  action (bot, msg) {
    let user = msg.channel.guild.members.find(user => user.id === msg.author.id)
    let role = msg.channel.guild.roles.find(role => role.name === 'Mr. Referee')
    let isMrRef = user.roles.find(roleId => roleId === role.id)
    if (isMrRef) {
      return false
    }

    return gemsList.getChannel(msg.channel.guild).then(channel => {
      gemsList.removeExpiredGems(msg.channel.guild)
      if (msg.channel.id === channel.id) {
        channel.deleteMessage(msg.id)
        return true
      }
      return false
    })
  }
}
