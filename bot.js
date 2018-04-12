const Monochrome = require('moodochrome-bot')
const path = require('path')

let configFilePath = path.join(__dirname, '/config.js')
let commandsDirectoryPath = path.join(__dirname, '/commands')
let messageProcessorsDirectoryPath = path.join(__dirname, '/message_processors')
let reactionProcessorsDirectoryPath = path.join(__dirname, '/reaction_processors')
let settingsFilePath = path.join(__dirname, '/server_settings.js')

let bot = new Monochrome(
  configFilePath,
  commandsDirectoryPath,
  messageProcessorsDirectoryPath,
  reactionProcessorsDirectoryPath,
  settingsFilePath)
bot.connect()
