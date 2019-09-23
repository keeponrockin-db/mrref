'use strict'
const gemsList = require('./../gems_list.js')

/**
* Manages gems list posts
*/
module.exports = {
  name: 'gemsreactions',
  action (msg, emoji, userId) {
    let user = msg.channel.guild.members.find(user => user.id === userId)
    if (!user.bot) {
      switch (emoji.name) {
        case '❌':
          return gemsList.closeRoom(msg.channel.guild, userId, msg.id)
        case '🥊':
          return gemsList.joinRoom(msg.channel.guild, userId, msg.id)
        default:
      }
    }

    return false
  }
}
