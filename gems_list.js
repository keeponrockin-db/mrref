'use strict'
const persistence = require('moodochrome-bot').persistence;

class GemsList {
  static setChannel(server, channel) {
    return persistence.editDataForServer(server.id, serverData => {
      serverData['gemsChannel'] = channel;
      return serverData;
    });
  }

  static getChannel(server) {
    return persistence.getDataForServer(server.id).then(serverData => {
      let channelName = serverData['gemsChannel'];
      return server.channels.find(channel => channel.name === channelName);
    });
  }

  static addNetplayerRole(server, userId) {
    let role = server.roles.find(role => role.name === 'Netplaying');
    if (role) {
      return server.addMemberRole(userId, role.id);
    }
  }

  static removeNetplayerRole(server, userId) {
    let role = server.roles.find(role => role.name === 'Netplaying');
    if (role) {
      return server.removeMemberRole(userId, role.id);
    }
  }

  static update_(server, gemsListChannel) {
    persistence.getDataForServer(server.id).then(serverData => {
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
            if (players) {
              content.embed.fields.push({ name: 'Players', value: players });
            }
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

  static updateRoom(server, creator, title) {
    return this.getChannel(server).then(channel => {
      return persistence.editDataForServer(server.id, serverData => {
        if (!serverData.gems) {
          serverData.gems = {};
        }

        if (!serverData.gems[creator.id]) {
          let content = {
            embed: { 
              title: 'reserved'
            }
          };
  
          return channel.createMessage(content).then(message => {
            this.addNetplayerRole(server, creator.id);
            channel.addMessageReaction(message.id, '🥊');
            channel.addMessageReaction(message.id, '❌');
  
            let gem = {
              title: title, 
              players: {}, 
              messageId: message.id
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
        this.update_(server, channel);
      });
    });
  }

  static updateInfo(server, creator, info) {
    return this.getChannel(server).then(channel => {
      return persistence.editDataForServer(server.id, serverData => {
        if (!serverData.gems) {
          return serverData;
        }
  
        if (!serverData.gems[creator.id]) {
          return serverData;
        }
  
        serverData.gems[creator.id].info = info;
        return serverData;
      }).then(() => {
        this.update_(server, channel);
      });
    });
  }

  static closeRoom_(server, gemsListChannel, userId) {
    let participants = [];
    persistence.editDataForServer(server.id, serverData => {
      let gems = serverData['gems'];
      Object.keys(gems[userId].players).forEach(playerId => {
        participants.push(playerId);
      });

      gemsListChannel.deleteMessage(gems[userId].messageId);
      // clean up replies
      if (gems[userId].replies) {
        gems[userId].replies.forEach(reply => {
          gemsListChannel.deleteMessage(reply);
        });
      }
      delete gems[userId];
      return serverData;
    }).then(() => {
      participants.forEach(playerId => {
        this.removeNetplayerRole(server, playerId);
      });
    });
  }

  static closeRoom(server, userId, messageId) {
    return this.getChannel(server).then(channel => {
      return persistence.getDataForServer(server.id).then(serverData => {
        let gems = serverData['gems'];
  
        let user = server.members.find(user => user.id === userId);
        let isAdmin = user.permission.json.manageMessages;
  
        if (isAdmin) {
          Object.keys(gems).forEach(playerId => {
            if (gems[playerId].messageId === messageId) {
              this.closeRoom_(server, channel, playerId);
              return true;
            }
          })
        }
  
        if (!gems[userId]) {
          return false;
        }
  
        let isOwner = (gems[userId].messageId === messageId);
        if (isOwner) {
          this.closeRoom_(server, channel, userId);
          return true;
        } else {
          return false;
        }
      })
    });
  }

  static joinRoom_(server, gemsListChannel, user, masterId) {
    persistence.editDataForServer(server.id, serverData => {
      let gems = serverData['gems'];
      if (!gems[masterId].players[user.id]) {
        gems[masterId].players[user.id] = user;
        return gemsListChannel.createMessage('<@!' + masterId + '>: ' + user.username + ' wants to join your game.').then(message => {
          if (!gems[masterId].replies) {
            gems[masterId].replies = [];
          }
          gems[masterId].replies.push(message.id);
          this.addNetplayerRole(server, user.id);
          msg.channel.deleteMessage(msg.id);
          return serverData;
        });
      } else {
        this.removeNetplayerRole(server, user.id);
        delete gems[masterId].players[user.id];
        return serverData;
      }
    }).then(() => {
      this.update_(server, gemsListChannel);
    });
  }

  static joinRoom(server, userId, messageId) {
    return this.getChannel(server).then(channel => {
      return persistence.getDataForServer(server.id).then(serverData => {
        let gems = serverData['gems'];
        let user = server.members.find(member => member.id === userId).user;
        if (user.bot) {
          return false;
        }
  
        Object.keys(gems).forEach(masterId => {
          let gem = gems[masterId];
          if (gem.messageId === messageId) {
            this.joinRoom_(server, channel, user, masterId);
          }
        })
      });
    });
  }

  static updateHeader(server, game, url) {
    return this.getChannel(server).then(channel => {
      return persistence.editDataForServer(server.id, serverData => {
        if (!serverData['gemHeaders']) {
          serverData['gemHeaders'] = {};
        }
        serverData['gemHeaders'][game] = url;
        return serverData;
      }).then(() => {
        this.update_(server, channel);
      });
    });
  }

  static updateIcon(server, icon, url) {
    return this.getChannel(server).then(channel => {
      return persistence.editDataForServer(server.id, serverData => {
        if (!serverData['gemIcons']) {
          serverData['gemIcons'] = {};
        }
        serverData['gemIcons'][icon] = url;
        return serverData;
      }).then(() => {
        this.update_(server, channel);
      });
    });
  }
}

module.exports = GemsList;