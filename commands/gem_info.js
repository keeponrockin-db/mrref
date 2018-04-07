'use strict'
const gemsList = require('./../gems_list.js');

/**
* Allows users to append other data
*/
module.exports = {
  commandAliases: ['!geminfo'],
  canBeChannelRestricted: true,
  uniqueId: 'geminfo8363765',
  serverAdminOnly: false,
  shortDescription: 'Add info to the gem.',
  usageExample: '!geminfo Search ID: j8c7',
  action(bot, msg, suffix) {
    return gemsList.getChannel(msg.channel.guild).then(channel => {
      return gemsList.updateInfo(msg.channel.guild, msg.author, suffix).then(() => {
        return msg.channel.createMessage(channel.mention + ' updated!').then(resolve => {
          setTimeout(() => {
            msg.channel.deleteMessage(msg.id);
            msg.channel.deleteMessage(resolve.id);
          }, 10000)
        });
      });
    });
  }
};
