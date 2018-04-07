'use strict'
const vevList = require('./../vev_list.js');

module.exports = {
  commandAliases: ['!award'],
  canBeChannelRestricted: true,
  uniqueId: 'award66666666',
  serverAdminOnly: false,
  shortDescription: 'Awards points',
  usageExample: '!award',
  action(bot, msg, suffix) {
    let server = msg.channel.guild;
    let re = /.*<@!?(.*?)>\s+(-?\d*).*/i;
    let results = suffix.match(re);

    if (!results) {
      return msg.channel.createMessage('Invalid id or points not specified');
    }

    let target = results[1];
    let amount = results[2];

    let user = server.members.find(user => user.id === msg.author.id);
    let isAdmin = user.permission.json.banMembers;

    if (isAdmin) {
      vevList.award(server, target, amount).then(points => {
        return msg.channel.createMessage('Points: ' + points);
      });
    } else {
      return msg.channel.createMessage('You don\'t have the authority to do that!');
    }
  }
};
