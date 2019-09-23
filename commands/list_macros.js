'use strict'
const persistence = require('moodochrome-bot').persistence

/**
* spits out all the macros
*/
module.exports = {
  commandAliases: ['!listmacros'],
  canBeChannelRestricted: true,
  uniqueId: 'listmacros72505368',
  serverAdminOnly: false,
  shortDescription: 'Add macro',
  usageExample: '!addmacro rev2 https://steamcdn-a.akamaihd.net/steam/apps/631560/header.jpg',
  action (bot, msg, suffix) {
    let server = msg.channel.guild

    let user = server.members.find(user => user.id === msg.author.id)
    let isAdmin = user.permission.json.banMembers
    if (isAdmin) {
      return persistence.editDataForServer(server.id, serverData => {
        return serverData
      }).then((serverData) => {
        if (!serverData.macros || Object.keys(serverData.macros).length === 0) {
          msg.channel.createMessage('There are no macros.')
        }
        for (var key in serverData.macros) {
          msg.channel.createMessage(`${key}: ${serverData.macros[key]}`)
        }
      })
    } else {
      return msg.channel.createMessage('You don\'t have the authority to do that!')
    }
  }
}
