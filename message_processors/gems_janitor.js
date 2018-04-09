'use strict'
const persistence = require('moodochrome-bot').persistence;

/**
* Adds bot uploaded comics to an archive
*/
module.exports = {
  name: 'gemsjanitor',
  action(bot, msg) {
    const gemsList = require('./../gems_list.js');
    let user = msg.channel.guild.members.find(user => user.id === msg.author.id);
    let role = msg.channel.guild.roles.find(role => role.name === 'Mr. Referee');
    let isMrRef = user.roles.find(roleId => roleId === role.id);
    if (isMrRef) {
      return false;
    }

    gemsList.removeExpiredGems(msg.channel.guild);

    return gemsList.getChannel(msg.channel.guild).then(channel => {
      if (msg.channel.id === channel.id) {
        channel.deleteMessage(msg.id);
      }
    });
  }
};