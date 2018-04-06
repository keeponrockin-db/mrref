'use strict'
const gemsList = require('./../gems_list.js');

/**
* Demonstrates persisting data.
*/
module.exports = {
  commandAliases: ['!geminfo'],
  canBeChannelRestricted: true,
  uniqueId: 'geminfo8363765',
  serverAdminOnly: false,
  shortDescription: 'Add info to the gem.',
  usageExample: '!geminfo Search ID: j8c7',
  action(bot, msg, suffix) {
    let gemsListChannel = msg.channel.guild.channels.find(channel => channel.name === 'gems-list');
    return gemsList.updateInfo(gemsListChannel, msg.author, suffix).then(() => {
      return msg.channel.createMessage('Gem info updated in #gems-list!').then(resolve => {
        setTimeout(() => {
          msg.channel.deleteMessage(resolve.id);
        }, 10000)
      });
    });
  }
};
