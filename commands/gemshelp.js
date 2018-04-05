'use strict'

/**
* Demonstrates persisting data.
*/
module.exports = {
  commandAliases: ['$gemshelp'],
  canBeChannelRestricted: true,
  uniqueId: 'gemshelp13857389',
  serverAdminOnly: false,
  shortDescription: 'help for gems',
  usageExample: '$gems Steam Xrd',
  action(bot, msg, suffix) {
    let message = 'Type ``$gems`` to start a room.\r\n';
    message += 'To list a specific game, type the name of the game after. Eg. ```$gems rev2```\r\n';
    message += 'To add a search id, password or some other misc info, after starting a room, use ``$gemcode`` followed by the code. Eg. ```$gemcode j8c7```\r\n';
    message += 'To add an image to specific room titles, use ``$gemheader`` followed by the game title and a link to the image. Eg. ```$gemheader rev2 https://steamcdn-a.akamaihd.net/steam/apps/631560/header.jpg```\r\n';
    return msg.channel.createMessage(message);
  }
};
