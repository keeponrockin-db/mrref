'use strict'
const persistence = require('moodochrome-bot').persistence

/**
* Changes main game visual for listed games
*/
module.exports = {
  commandAliases: ['!deletemacro'],
  canBeChannelRestricted: true,
  uniqueId: 'deletemacro36872505',
  serverAdminOnly: false,
  shortDescription: 'Delete macro',
  usageExample: '!deletemacro rev2',
  action (bot, msg, suffix) {
    let server = msg.channel.guild

    if (!suffix) {
      return msg.channel.createMessage('Please specify macro')
    }

    let macro = suffix

    let user = server.members.find(user => user.id === msg.author.id)
    let isAdmin = user.permission.json.banMembers
    if (isAdmin) {
      return persistence.editDataForServer(server.id, serverData => {
        if (!serverData.macros) {
          serverData.macros = {}
        }
        delete serverData.macros['!' + macro.toLowerCase()]
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
