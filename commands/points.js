'use strict'
const vevList = require('./../vev_list.js');

module.exports = {
  commandAliases: ['!points'],
  canBeChannelRestricted: true,
  uniqueId: 'points66666666',
  serverAdminOnly: false,
  shortDescription: 'Report points',
  usageExample: '!points',
  action(bot, msg, suffix) {
    vevList.points(msg.channel.guild, msg.author.id).then(points => {
      return msg.channel.createMessage('Points: ' + points);
    });
  }
};
