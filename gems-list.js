'use strict'
const persistence = require('moodochrome-bot').persistence;

class GemsList {
  static update(gemsListChannel) {
    persistence.getGlobalData().then(globalData => {
      let gems = globalData['gems'];
      if (gems) {
        Object.keys(gems).forEach(userId => {
          let gem = gems[userId];

          let players = '**Players**:';
          Object.keys(gem.players).forEach(playerId => {
            let player = gem.players[playerId];
            players += ' ' + player.username + ',';
          });
          players = players.slice(0, -1);

          let content = {
            embed: {
              title: gem.title,
              description: players
            }
          };
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

  static closeRoom(gemsListChannel, userId) {
    persistence.editGlobalData(globalData => {
      let gems = globalData['gems'];
      gemsListChannel.deleteMessage(gems[userId].messageId);
      delete gems[userId];
      return globalData;
    });
  }

  static tryCloseRoom(gemsListChannel, userId, messageId) {
    return persistence.getGlobalData().then(globalData => {
      let gems = globalData['gems'];
      if (!gems[userId]) {
        return false;
      }

      let isOwner = (gems[userId].messageId === messageId);
      if (isOwner) {
        this.closeRoom(gemsListChannel, userId);
        return true;
      } else {
        return false;
      }
    })
  }

  static joinRoom(gemsListChannel, user, masterId) {
    persistence.editGlobalData(globalData => {
      let gems = globalData['gems'];
      if (!gems[masterId].players[user.id]) {
        gems[masterId].players[user.id] = user;
      } else {
        delete gems[masterId].players[user.id];
      }
      return globalData;
    }).then(() => {
      this.update(gemsListChannel);
    });
  }

  static tryJoinRoom(gemsListChannel, userId, messageId) {
    return persistence.getGlobalData().then(globalData => {
      let gems = globalData['gems'];
      let user = gemsListChannel.guild.members.find(member => member.id === userId).user;
      if (user.bot) {
        return false;
      }

      Object.keys(gems).forEach(masterId => {
        let gem = gems[masterId];
        if (gem.messageId === messageId) {
          this.joinRoom(gemsListChannel, user, masterId);
        }
      })
    });
  }
}

module.exports = GemsList;