'use strict'
const persistence = require('monochrome-bot').persistence;

/**
* Adds bot uploaded comics to an archive
*/
module.exports = {
  name: 'comicarchive',
  action(bot, msg) {
    let attachment = msg.attachments[0];
    if (msg.author.bot && attachment) {
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