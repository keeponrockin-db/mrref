'use strict'
const persistence = require('moodochrome-bot').persistence;

/**
* Adds bot uploaded comics to an archive
*/
module.exports = {
  name: 'comicarchive',
  action(bot, msg) {
    let attachment = msg.attachments[0];
    if (msg.author.bot && attachment) {
      if (attachment.filename === 'comic.png') {
        let serverId = msg.channel.guild.id;
        return persistence.editDataForServer(serverId, globalData => {
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