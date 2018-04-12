module.exports = [
  {
    'type': 'CATEGORY', // "CATEGORY" for a group of settings, "SETTING" for a setting.
    'userFacingName': 'fun', // This is the name of the category. The user will see it if they use the settings command.
    'children': // A category's children can be either other CATEGORYs or SETTINGs, but not both.
    [
      {
        'type': 'SETTING',
        'userFacingName': 'countdown_start', // This is the name of the setting. The user will see it if they use the settings command. Its full path is fun/countdown_start.
        'description': "This setting controls what number I'll count down from when you use the bot!countdown command.",
        'valueType': 'INTEGER', // Can be INTEGER, FLOAT, STRING, or BOOLEAN
        'defaultDatabaseFacingValue': 10,
        'allowedDatabaseFacingValues': 'Range(1, 10)' // This can be a range as shown here, or an array of discrete values, or it can be undefined.
      }
    ]
  }
]
