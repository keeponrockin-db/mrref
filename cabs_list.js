'use strict'
const persistence = require('moodochrome-bot').persistence

class CabsList {
  static setChannel (server, channel) {
    return persistence.editDataForServer(server.id, serverData => {
      serverData.cabsChannel = channel
      return serverData
    })
  }

  static getChannel (server) {
    return persistence.getDataForServer(server.id).then(serverData => {
      let channelName = serverData.cabsChannel
      return server.channels.find(channel => channel.name === channelName)
    })
  }

  static updateCabs (channel, user, day, time, note) {
    return persistence.editDataForServer(channel.guild.id, serverData => {
      if (!serverData.cabsChannel) { return }
      if (!serverData.cabs) { serverData.cabs = {} }
      if (!serverData.cabs[channel.id]) {
        serverData.cabs[channel.id] = {}
        let schedule = {
          [user.id]: {
            day: day,
            time: time,
            note: note
          }
        }
        return this.getChannel(channel.guild).then(cabsChannel => {
          return cabsChannel.createMessage(`**${channel.name}**\n${this._scheduleToText(schedule)}`).then(message => {
            serverData.cabs[channel.id] = {
              name: channel.name,
              postId: message.id,
              schedule: schedule
            }
            return serverData
          })
        })
      } else {
        let schedule = serverData.cabs[channel.id].schedule
        schedule[user.id] = {
          day: day,
          time: time,
          note: note
        }

        return this.getChannel(channel.guild).then(cabsChannel => {
          let postId = serverData.cabs[channel.id].postId
          cabsChannel.editMessage(postId, `**${channel.name}**\n${this._scheduleToText(schedule)}`)
          return serverData
        })
      }
    })
  }

  static _scheduleToText (schedule) {
    let formattedSchedule = {}
    Object.keys(schedule).forEach(user => {
      let day = schedule[user].day
      let time = schedule[user].time
      let note = schedule[user].note

      if (!formattedSchedule[day]) { formattedSchedule[day] = {} }
      if (!formattedSchedule[day][time]) { formattedSchedule[day][time] = {} }
      formattedSchedule[day][time][user] = `<@!${user}> (${note})`
    })
    let text = ''
    let days = Object.keys(formattedSchedule).sort()
    days.forEach(day => {
      let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      text += `${daysOfTheWeek[day]}\n`
      let times = Object.keys(formattedSchedule[day]).sort()
      times.forEach(time => {
        Object.keys(formattedSchedule[day][time]).forEach(user => {
          text += `${time}: ${formattedSchedule[day][time][user]}\n`
        })
      })
    })
    return text
  }
}

module.exports = CabsList
