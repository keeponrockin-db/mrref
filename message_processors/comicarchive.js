'use strict'
const persistence = require('monochrome-bot').persistence;

/**
* Adds bot uploaded comics to an archive
*/
module.exports = {
  name: 'comicarchive',
  action(bot, msg) {
    if (msg.author.bot && msg.attachments) {
      let attachment = msg.attachments[0];
      if (attachment.filename === 'comic.png') {
        return persistence.editGlobalData(globalData => {
          if (!globalData.comics) {
            globalData.comics = [];
          }
          globalData.comics.push(attachment.url);
          return globalData;
        });
      }
      return true;
    }
    return false;
  }
};