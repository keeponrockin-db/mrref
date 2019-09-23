'use strict'
const vevList = require('./../vev_list.js')

/**
* Chance to regen when you post
*/
module.exports = {
  name: 'pointsregen',
  action (bot, msg) {
    if (msg.author.bot) {
      return false
    }

    if (msg.content) {
      let server = msg.channel.guild
      vevList.regen(server, msg.author.id)
    }
    return false
  }
}
