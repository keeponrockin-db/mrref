'use strict'
const gemsList = require('./../gems_list.js')

/**
* Changes main game visual for listed games
*/
module.exports = {
  commandAliases: ['!gemheader'],
  canBeChannelRestricted: true,
  uniqueId: 'gemheader43187821',
  serverAdminOnly: false,
  shortDescription: 'Add header to the gems list.',
  usageExample: '!gemheader rev2 https://steamcdn-a.akamaihd.net/steam/apps/631560/header.jpg',
  action (bot, msg, suffix) {
    let re = /\s*(.*?)\s+(http.*)/i
    let results = suffix.match(re)

    if (!results) {
      return msg.channel.createMessage('Invalid header')
    }

    let title = results[1]
    let url = results[2]

    return gemsList.updateHeader(msg.channel.guild, title, url).then(() => {
      return msg.channel.createMessage('Gems header updated!').then(response => {
        setTimeout(() => {
          msg.channel.deleteMessage(msg.id)
          msg.channel.deleteMessage(response.id)
        }, 10000)
      })
    })
  }
}
