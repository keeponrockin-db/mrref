'use strict'
const cabsList = require('./../cabs_list.js')

/**
* Initializes the channel for cabs list
*/
module.exports = {
  commandAliases: ['!cabschannel'],
  canBeChannelRestricted: true,
  uniqueId: 'cabchannel27273293',
  serverAdminOnly: false,
  shortDescription: 'Set channel',
  usageExample: '!cabschannel netplaying',
  action (bot, msg, suffix) {
    cabsList.setChannel(msg.channel.guild, suffix).then(() => {
      return msg.channel.createMessage('Cabs channel updated!').then(response => {
        setTimeout(() => {
          msg.channel.deleteMessage(msg.id)
          msg.channel.deleteMessage(response.id)
        }, 10000)
      })
    })
  }
}
