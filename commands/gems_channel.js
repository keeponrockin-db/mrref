'use strict'
const gemsList = require('./../gems_list.js');

/**
* Initializes the channel for gems list
*/
module.exports = {
  commandAliases: ['!gemschannel'],
  canBeChannelRestricted: true,
  uniqueId: 'gemchannel27273293',
  serverAdminOnly: false,
  shortDescription: 'Set channel',
  usageExample: '!gemschannel netplaying',
  action(bot, msg, suffix) {
    gemsList.setChannel(msg.channel.guild, suffix).then(() => {
      return msg.channel.createMessage('Gems channel updated!').then(resolve => {
        setTimeout(() => {
          msg.channel.deleteMessage(msg.id);
          msg.channel.deleteMessage(resolve.id);
        }, 10000)
      });
    });
  }
};
