'use strict'
const persistence = require('moodochrome-bot').persistence

/**
* Changes main game visual for listed games
*/
module.exports = {
  commandAliases: ['!addmacro'],
  canBeChannelRestricted: true,
  uniqueId: 'addmacro36872505',
  serverAdminOnly: false,
  shortDescription: 'Add macro',
  usageExample: '!addmacro rev2 https://steamcdn-a.akamaihd.net/steam/apps/631560/header.jpg',
  action (bot, msg, suffix) {
    let server = msg.channel.guild
    let re = /\s*(.*?)\s+(http.*)/i
    let results = suffix.match(re)

    if (!results) {
      return msg.channel.createMessage('Invalid link')
    }

    let macro = results[1]
    let url = results[2]

    let user = server.members.find(user => user.id === msg.author.id)
    let isAdmin = user.permission.json.banMembers
    if (isAdmin) {
      return persistence.editDataForServer(server.id, serverData => {
        if (!serverData.macros) {
          serverData.macros = {}
        }
        serverData.macros['!' + macro.toLowerCase()] = url
        return serverData
      }).then(() => {
        return msg.channel.createMessage('Macros updated!').then(response => {
          setTimeout(() => {
            msg.channel.deleteMessage(msg.id)
            msg.channel.deleteMessage(response.id)
          }, 10000)
        })
      })
    } else {
      return msg.channel.createMessage('You don\'t have the authority to do that!')
    }
  }
}
