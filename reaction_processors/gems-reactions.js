'use strict'
const persistence = require('moodochrome-bot').persistence;
const gemsList = require('./../gems-list.js');

/**
* Adds bot uploaded comics to an archive
*/
module.exports = {
  name: 'gemsreactions',
  action(msg, emoji, userId) {
    return persistence.editGlobalData(globalData => {
      let user = msg.channel.guild.members.find(member => member.id === userId).user;
      if (user.bot) {
        return globalData;
      }

      let gemsListChannel = msg.channel.guild.channels.find(channel => channel.name === 'gems-list');
      let gems = globalData['gems'];
      if (gems) {
        let isOwner = false;
        if (gems[userId]) {
          isOwner = (msg.id === gems[userId].messageId);
        }

        if (isOwner) {
          switch (emoji.name) {
            case '❌':
              delete gems[userId];
              gemsListChannel.deleteMessage(msg.id);
              break;
            default:
          }
        } else {
          let creatorId = null;
          Object.keys(gems).forEach(id => {
            if (msg.id === gems[id].messageId) {
              creatorId = id;
            }
          });

          if (creatorId) {
            switch (emoji.name) {
              case '🥊':
                if (!gems[creatorId].players[userId]) {
                  gems[creatorId].players[userId] = user;
                } else {
                  delete gems[creatorId].players[userId];
                  console.log(gems);
                }
                break;
              default:
            }
          }
        }
      }
      return globalData;
    }).then(() => {
      let gemsListChannel = msg.channel.guild.channels.find(channel => channel.name === 'gems-list');
      gemsList.update(gemsListChannel);
    });
  }
};