'use strict'
const gemsList = require('./../gems_list.js');

/**
* Adds bot uploaded comics to an archive
*/
module.exports = {
  name: 'gemsreactions',
  action(msg, emoji, userId) {
    let user = msg.channel.guild.members.find(user => user.id === userId);
    if (!user.bot) {
      switch (emoji.name) {
        case '❌':
          return gemsList.closeRoom(msg.channel.guild, userId, msg.id);
          break;
        case '🥊':
          return gemsList.joinRoom(msg.channel.guild, userId, msg.id);
          break;
        default:
      }
    }

    return false;
  }
};