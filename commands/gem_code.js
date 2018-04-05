'use strict'
const gemsList = require('./../gems_list.js');

/**
* Demonstrates persisting data.
*/
module.exports = {
  commandAliases: ['$gemcode'],
  canBeChannelRestricted: true,
  uniqueId: 'gemcode8363765',
  serverAdminOnly: false,
  shortDescription: 'Add code to the gem.',
  usageExample: '$gemcode A12B',
  action(bot, msg, suffix) {
    let gemsListChannel = msg.channel.guild.channels.find(channel => channel.name === 'gems-list');
    return gemsList.updateCode(gemsListChannel, msg.author, suffix).then(() => {
      return msg.channel.createMessage('Gem code updated!').then(resolve => {
        setTimeout(() => {
          msg.channel.deleteMessage(resolve.id);
        }, 10000)
      });
    });
  }
};
