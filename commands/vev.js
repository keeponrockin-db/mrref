'use strict'
const vevList = require('./../vev_list.js');

module.exports = {
  commandAliases: ['!vev'],
  canBeChannelRestricted: true,
  uniqueId: 'vev66666666',
  serverAdminOnly: false,
  shortDescription: 'Send dissenters to the gulag',
  usageExample: '!vev @criminal',
  action(bot, msg, suffix) {
    
    let re = /.*<@!?(.*?)>.*/i;
    let results = suffix.match(re);

    if (!results) {
      return msg.channel.createMessage('Invalid id');
    }

    let userId = results[1];
    vevList.vev(userId, msg.channel, msg.author.id).then(success => {
      if (success) {
        return msg.channel.createMessage('https://cdn.discordapp.com/attachments/129028444888498176/322585646315208704/JPEG_20170608_131324.jpg').then(response => {
          setTimeout(() => {
            msg.channel.deleteMessage(response.id);
          }, 10000);
        });
      } else {
        return msg.channel.createMessage('You don\'t have enough points for this vev!');
      }
    });
  }
};
