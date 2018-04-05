'use strict'
const persistence = require('moodochrome-bot').persistence;
const gemsList = require('./../gems-list.js');

/**
* Demonstrates persisting data.
*/
module.exports = {
  commandAliases: ['$gems'],
  canBeChannelRestricted: true,
  uniqueId: 'gems13857389',
  serverAdminOnly: false,
  shortDescription: 'Add yourself to the gems list.',
  usageExample: '$gems Steam Xrd',
  action(bot, msg, suffix) {
    return persistence.editGlobalData(globalData => {
      let title = suffix;
      if (!suffix) { title = 'Any gems'; }

      if (!globalData.gems) {
        globalData.gems = {};
      }

      if (!globalData.gems[msg.author.id]) {
        let gemsListChannel = msg.channel.guild.channels.find(channel => channel.name === 'gems-list');

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

          gem.players[msg.author.id] = msg.author;

          globalData.gems[msg.author.id] = gem;
          return globalData;
        });
      } else {
        globalData.gems[msg.author.id].title = title;
      }
      
      return globalData;
    }).then(() => {
      let gemsListChannel = msg.channel.guild.channels.find(channel => channel.name === 'gems-list');
      gemsList.update(gemsListChannel);
      return msg.channel.createMessage('Gems list updated!');
    });
  },
};
