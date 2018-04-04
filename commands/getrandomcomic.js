'use strict'
const persistence = require('monochrome-bot').persistence;

/**
* Demonstrates getting persisted data.
*/
module.exports = {
  commandAliases: ['bot!getcomic'],
  canBeChannelRestricted: false,
  serverAdminOnly: false,
  uniqueId: 'getComic70327',
  shortDescription: 'Get a random comic from my database.',
  longDescription: 'Get a random comic from my database. I will randomly select a comic from among the comics stored when a bot uploads a comic.',
  action(bot, msg, suffix, settings, extension) {
    return persistence.getGlobalData().then(globalData => {
      if (!globalData.comics) {
        return msg.channel.createMessage('There aren\'t any comics yet :( Use the Septapus to make some new comics.');
      }

      let comicIndex = Math.floor(Math.random() * globalData.comics.length);
      if (extension === '-newest') {
        comicIndex = globalData.comics.length - 1;
      }
      return msg.channel.createMessage(globalData.comics[comicIndex]);
    });
  },
  canHandleExtension(extension) {
    return extension === '-newest';
  }
};
