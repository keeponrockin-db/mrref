'use strict'
const gemsList = require('./../gems-list.js');

/**
* Demonstrates persisting data.
*/
module.exports = {
  commandAliases: ['$gemheader'],
  canBeChannelRestricted: true,
  uniqueId: 'gemheader43187821',
  serverAdminOnly: false,
  shortDescription: 'Add header to the gems list.',
  usageExample: '$gemheader rev2 https://steamcdn-a.akamaihd.net/steam/apps/631560/header.jpg?t=1496242140',
  action(bot, msg, suffix) {
    let re = /\s*(.*?)\s+(http.*)/i;
    let results = suffix.match(re);
    let title = results[1];
    let url = results[2];

    let gemsListChannel = msg.channel.guild.channels.find(channel => channel.name === 'gems-list');
    return gemsList.updateHeader(gemsListChannel, title, url).then(() => {
      return msg.channel.createMessage('Gems header updated!').then(resolve => {
        setTimeout(() => {
          msg.channel.deleteMessage(resolve.id);
        }, 10000)
      });
    });
  }
};
