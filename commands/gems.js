'use strict'
const gemsList = require('./../gems_list.js');

/**
* Demonstrates persisting data.
*/
module.exports = {
  commandAliases: ['!gems'],
  canBeChannelRestricted: true,
  uniqueId: 'gems13857389',
  serverAdminOnly: false,
  shortDescription: 'Add yourself to the gems list.',
  usageExample: '!gems Steam Xrd',
  action(bot, msg, suffix) {
    let title = suffix;
    let gemsListChannel = msg.channel.guild.channels.find(channel => channel.name === 'gems-list');
    return gemsList.updateRoom(gemsListChannel, msg.author, title).then(() => {
      return msg.channel.createMessage('Gems list updated!');
    });
  }
};
