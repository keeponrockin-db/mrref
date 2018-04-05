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
}

module.exports = GemsList;