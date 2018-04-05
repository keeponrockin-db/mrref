'use strict'
const persistence = require('moodochrome-bot').persistence;

class GemsList {
  static update(gemsListChannel) {
    persistence.getGlobalData().then(globalData => {
      let gems = globalData['gems'];
      if (gems) {
        Object.keys(gems).forEach(userId => {
          let gem = gems[userId];
          
          let code = '';
          if (gem.code) {
            code = '**Code:** ' + gem.code + '\r\n';
          }

          let players = '**Players:** ';
          Object.keys(gem.players).forEach(playerId => {
            players += ' <@' + playerId + '>,';
          });
          players = players.slice(0, -1);

          let content = {
            embed: {
              title: gem.title,
              description: code + players
            }
          };

          let gemHeaders = globalData['gemHeaders'];
          if (gemHeaders) {
            content.embed.image = {
              url: gemHeaders[gem.title]
            };
          }

          gemsListChannel.editMessage(gem.messageId, content);
        });
      }
    });
  }

  static updateRoom(gemsListChannel, creator, title) {
    return persistence.editGlobalData(globalData => {
      if (!globalData.gems) {
        globalData.gems = {};
      }

      if (!globalData.gems[creator.id]) {
        let content = {
          embed: { 
            title: 'reserved'
          }
        };

        return gemsListChannel.createMessage(content).then(resolve => {
          gemsListChannel.addMessageReaction(resolve.id, '🥊');
          gemsListChannel.addMessageReaction(resolve.id, '❌');

          let gem = {
            title: title, 
            players: {}, 
            messageId: resolve.id
          };

          gem.players[creator.id] = creator;

          globalData.gems[creator.id] = gem;
          return globalData;
        });
      } else {
        globalData.gems[creator.id].title = title;
      }
      
      return globalData;
    }).then(() => {
      this.update(gemsListChannel);
    });
  }

  static updateCode(gemsListChannel, creator, code) {
    return persistence.editGlobalData(globalData => {
      if (!globalData.gems) {
        return false;
      }

      if (!globalData.gems[creator.id]) {
        return false;
      }

      globalData.gems[creator.id].code = code;
      return globalData;
    }).then(() => {
      this.update(gemsListChannel);
    });
  }

  static closeRoom_(gemsListChannel, userId) {
    persistence.editGlobalData(globalData => {
      let gems = globalData['gems'];
      gemsListChannel.deleteMessage(gems[userId].messageId);
      // clean up replies
      if (gems[userId].replies) {
        gems[userId].replies.forEach(reply => {
          gemsListChannel.deleteMessage(reply);
        });
      }
      delete gems[userId];
      return globalData;
    });
  }

  static closeRoom(gemsListChannel, userId, messageId) {
    return persistence.getGlobalData().then(globalData => {
      let gems = globalData['gems'];
      if (!gems[userId]) {
        return false;
      }

      let isOwner = (gems[userId].messageId === messageId);
      if (isOwner) {
        this.closeRoom_(gemsListChannel, userId);
        return true;
      } else {
        return false;
      }
    })
  }

  static joinRoom_(gemsListChannel, user, masterId) {
    persistence.editGlobalData(globalData => {
      let gems = globalData['gems'];
      if (!gems[masterId].players[user.id]) {
        gems[masterId].players[user.id] = user;
        return gemsListChannel.createMessage('<@' + masterId + '>: ' + user.username + ' has joined your game.').then(resolve => {
          if (!gems[masterId].replies) {
            gems[masterId].replies = [];
          }
          gems[masterId].replies.push(resolve.id);
          return globalData;
        });
      } else {
        delete gems[masterId].players[user.id];
        return globalData;
      }
    }).then(() => {
      this.update(gemsListChannel);
    });
  }

  static joinRoom(gemsListChannel, userId, messageId) {
    return persistence.getGlobalData().then(globalData => {
      let gems = globalData['gems'];
      let user = gemsListChannel.guild.members.find(member => member.id === userId).user;
      if (user.bot) {
        return false;
      }

      Object.keys(gems).forEach(masterId => {
        let gem = gems[masterId];
        if (gem.messageId === messageId) {
          this.joinRoom_(gemsListChannel, user, masterId);
        }
      })
    });
  }

  static updateHeader(gemsListChannel, title, url) {
    return persistence.editGlobalData(globalData => {
      if (!globalData['gemHeaders']) {
        globalData['gemHeaders'] = {};
      }
      globalData['gemHeaders'][title] = url;
      return globalData;
    }).then(() => {
      this.update(gemsListChannel);
    });
  }
}

module.exports = GemsList;