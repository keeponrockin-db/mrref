let monochrome = require('moodochrome-bot');

let configFilePath = __dirname + '/config.js';
let commandsDirectoryPath = __dirname + '/commands';
let messageProcessorsDirectoryPath = __dirname + '/message_processors';
let reactionProcessorsDirectoryPath = __dirname + '/reaction_processors';
let settingsFilePath = __dirname + '/server_settings.js';

let bot = new monochrome(
  configFilePath,
  commandsDirectoryPath,
  messageProcessorsDirectoryPath,
  reactionProcessorsDirectoryPath,
  settingsFilePath);
bot.connect();