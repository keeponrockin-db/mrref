'use strict'
const persistence = require('moodochrome-bot').persistence

/**
* Spits out a comic archived by comic archive
*/
module.exports = {
  commandAliases: ['!comic'],
  canBeChannelRestricted: false,
  serverAdminOnly: false,
  uniqueId: 'getComic70327',
  shortDescription: 'Get a random comic from my database.',
  longDescription: 'Get a random comic from my database. I will randomly select a comic from among the comics stored when a bot uploads a comic.',
  action (bot, msg, suffix, settings, extension) {
    let serverId = msg.channel.guild.id
    return persistence.getDataForServer(serverId).then(serverData => {
      if (!serverData.comics) {
        return msg.channel.createMessage('There aren\'t any comics yet :( Use Septapus to make some new comics.')
      }
      let comics = serverData.comics

      let comicIndex = Math.floor(Math.random() * comics.length)
      if (extension === '-newest') {
        comicIndex = comics.length - 1
      }
      return msg.channel.createMessage(comics[comicIndex])
    })
  },
  canHandleExtension (extension) {
    return extension === '-newest'
  }
}
