'use strict'
const persistence = require('moodochrome-bot').persistence

/**
* Adds bot uploaded comics to an archive
*/
module.exports = {
  name: 'findmacro',
  action (bot, msg) {
    if (msg.author.bot) {
      return false
    }

    if (msg.content) {
      let serverId = msg.channel.guild.id
      persistence.getDataForServer(serverId).then(serverData => {
        if (!serverData.macros) {
          serverData.macros = {}
        }
        let macro = serverData.macros[msg.content.toLowerCase()]
        if (macro) {
          msg.channel.createMessage(macro)
          return true
        }
      })
    }
    return false
  }
}
