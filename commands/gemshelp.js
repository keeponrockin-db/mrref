'use strict'

/**
* Demonstrates persisting data.
*/
module.exports = {
  commandAliases: ['!gemshelp'],
  canBeChannelRestricted: true,
  uniqueId: 'gemshelp13857389',
  serverAdminOnly: false,
  shortDescription: 'help for gems',
  usageExample: '!gems rev2',
  action(bot, msg, suffix) {
    let message = 'Type ``!gems`` to start a room.\r\n';
    message += 'To list a specific game, type the name of the game after. Eg. ```!  gems rev2```\r\n';
    message += 'To join a listed game, click the 🥊 reaction\r\n';
    message += 'To remove your own room, click the ❌ reaction (Only the creators can do this)\r\n';
    message += 'To add a search id, password or some other misc info, after starting a room, use ``!geminfo`` followed by the code. Eg. ```!geminfo Search ID: j8c7```\r\n';
    return msg.channel.createMessage(message);
  }
};
