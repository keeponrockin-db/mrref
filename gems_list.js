'use strict'
const persistence = require('moodochrome-bot').persistence;

class GemsList {
  static update(gemsListChannel) {
    let serverId = gemsListChannel.guild.id;
    persistence.getDataForServer(serverId).then(serverData => {
      let gems = serverData['gems'];
      if (gems) {
        Object.keys(gems).forEach(userId => {
          let gem = gems[userId];

          let content = {
            embed: {
              title: gem.title,
              fields: []
            }
          };

          if (gem.players) {
            let players = '';
            Object.keys(gem.players).forEach(playerId => {
              players += ' <@!' + playerId + '> (' + gem.players[playerId].username + '),';
            });
            players = players.slice(0, -1);
            content.embed.fields.push({ name: 'Players', value: players });
          }

          if (gem.info) {
            content.embed.fields.push({ name: 'Info', value: gem.info });
          }

          let gemHeaders = serverData['gemHeaders'];
          if (gemHeaders) {
            Object.keys(gemHeaders).forEach(game => {
              if (gem.title.includes(game)) {
                content.embed.image = {
                  url: gemHeaders[game]
                };
              }
            })
          }

          let gemIcons = serverData['gemIcons'];
          if (gemIcons) {
            Object.keys(gemIcons).forEach(icon => {
              if (gem.title.includes(icon)) {
                content.embed.thumbnail = {
                  url: gemIcons[icon]
                };
              }
            })
          }

          gemsListChannel.editMessage(gem.messageId, content);
        });
      }
    });
  }

  static updateRoom(gemsListChannel, creator, title) {
    let serverId = gemsListChannel.guild.id;
    return persistence.editDataForServer(serverId, serverData => {
      if (!serverData.gems) {
        serverData.gems = {};
      }

      if (!serverData.gems[creator.id]) {
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

          serverData.gems[creator.id] = gem;
          return serverData;
        });
      } else {
        serverData.gems[creator.id].title = title;
      }
      
      return serverData;
    }).then(() => {
      this.update(gemsListChannel);
    });
  }

  static updateInfo(gemsListChannel, creator, info) {
    let serverId = gemsListChannel.guild.id;
    return persistence.editDataForServer(serverId, serverData => {
      if (!serverData.gems) {
        return false;
      }

      if (!serverData.gems[creator.id]) {
        return false;
      }

      serverData.gems[creator.id].info = info;
      return serverData;
    }).then(() => {
      this.update(gemsListChannel);
    });
  }

  static closeRoom_(gemsListChannel, userId) {
    let serverId = gemsListChannel.guild.id;
    persistence.editDataForServer(serverId, serverData => {
      let gems = serverData['gems'];
      gemsListChannel.deleteMessage(gems[userId].messageId);
      // clean up replies
      if (gems[userId].replies) {
        gems[userId].replies.forEach(reply => {
          gemsListChannel.deleteMessage(reply);
        });
      }
      delete gems[userId];
      return serverData;
    });
  }

  static closeRoom(gemsListChannel, userId, messageId) {
    let serverId = gemsListChannel.guild.id;
    return persistence.getDataForServer(serverId).then(serverData => {
      let gems = serverData['gems'];

      let user = gemsListChannel.guild.members.find(user => user.id === userId);
      let isAdmin = user.permission.json.manageMessages;

      if (isAdmin) {
        Object.keys(gems).forEach(playerId => {
          if (gems[playerId]) {
            if (gems[playerId].messageId === messageId) {
              this.closeRoom_(gemsListChannel, playerId);
              return true;
            }
          }
        })
      }

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
    let serverId = gemsListChannel.guild.id;
    persistence.editDataForServer(serverId, serverData => {
      let gems = serverData['gems'];
      if (!gems[masterId].players[user.id]) {
        gems[masterId].players[user.id] = user;
        return gemsListChannel.createMessage('<@!' + masterId + '>: ' + user.username + ' has joined your game.').then(resolve => {
          if (!gems[masterId].replies) {
            gems[masterId].replies = [];
          }
          gems[masterId].replies.push(resolve.id);
          return serverData;
        });
      } else {
        delete gems[masterId].players[user.id];
        return serverData;
      }
    }).then(() => {
      this.update(gemsListChannel);
    });
  }

  static joinRoom(gemsListChannel, userId, messageId) {
    let serverId = gemsListChannel.guild.id;
    return persistence.getDataForServer(serverId).then(serverData => {
      let gems = serverData['gems'];
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

  static updateHeader(gemsListChannel, game, url) {
    let serverId = gemsListChannel.guild.id;
    return persistence.editDataForServer(serverId, serverData => {
      if (!serverData['gemHeaders']) {
        serverData['gemHeaders'] = {};
      }
      serverData['gemHeaders'][game] = url;
      return serverData;
    }).then(() => {
      this.update(gemsListChannel);
    });
  }

  static updateIcon(gemsListChannel, icon, url) {
    let serverId = gemsListChannel.guild.id;
    return persistence.editDataForServer(serverId, serverData => {
      if (!serverData['gemIcons']) {
        serverData['gemIcons'] = {};
      }
      serverData['gemIcons'][icon] = url;
      return serverData;
    }).then(() => {
      this.update(gemsListChannel);
    });
  }
}

module.exports = GemsList;