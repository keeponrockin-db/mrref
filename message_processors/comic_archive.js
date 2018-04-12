'use strict'
const persistence = require('moodochrome-bot').persistence

/**
* Adds bot uploaded comics to an archive
*/
module.exports = {
  name: 'comicarchive',
  action (bot, msg) {
    let attachment = msg.attachments[0]
    if (msg.author.bot && attachment) {
      if (attachment.filename === 'comic.png') {
        let serverId = msg.channel.guild.id
        return persistence.editDataForServer(serverId, serverData => {
          if (!serverData.comics) {
            serverData.comics = []
          }
          let comics = serverData.comics
          comics.push(attachment.url)
          return serverData
        })
      }
      return true
    }
    return false
  }
}
