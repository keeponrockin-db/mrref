'use strict'
const persistence = require('moodochrome-bot').persistence

class VevList {
  static vev (userId, channel, issuerId) {
    let server = channel.guild
    let success = false
    // in milliseconds
    let sentenceLength = 90000

    return persistence.editDataForServer(server.id, serverData => {
      if (!serverData.vevPoints) {
        serverData.vevPoints = {}
      }
      let points = serverData.vevPoints

      if (!points[issuerId] && points[issuerId] !== 0) {
        points[issuerId] = 420
      }

      let cost = 20

      if (points[issuerId] >= cost) {
        points[issuerId] -= cost
        success = true
      }

      return serverData
    }).then(() => {
      if (success) {
        this._vev(userId, channel, sentenceLength)
      }
      return success
    })
  }

  static _vev (userId, channel, sentenceLength) {
    let server = channel.guild
    return persistence.editDataForServer(server.id, serverData => {
      if (!serverData.vevList) {
        serverData.vevList = {}
      }

      let vevList = serverData.vevList
      if (!vevList[userId]) {
        vevList[userId] = {}
      }

      vevList[userId][channel.id] = Date.now() + sentenceLength

      setTimeout(() => {
        this.unvev(userId, channel)
      }, sentenceLength)

      channel.editPermission(userId, null, 2048, 'member')

      return serverData
    })
  }

  static unvev (userId, channel, issuerId) {
    let server = channel.guild
    let success = false
    return persistence.editDataForServer(server.id, serverData => {
      if (!serverData.vevPoints) {
        serverData.vevPoints = {}
      }
      let points = serverData.vevPoints

      if (issuerId) {
        if (!points[issuerId] && points[issuerId] !== 0) {
          points[issuerId] = 420
        }

        let cost = 20

        if (points[issuerId] >= cost) {
          points[issuerId] -= cost
          success = true
        }
      } else {
        success = true
      }

      return serverData
    }).then(() => {
      if (success) {
        this._unvev(userId, channel)
      }
      return success
    })
  }

  static _unvev (userId, channel) {
    let server = channel.guild
    return persistence.editDataForServer(server.id, serverData => {
      if (!serverData.vevList) {
        serverData.vevList = {}
      }

      let vevList = serverData.vevList
      if (vevList[userId]) {
        delete vevList[userId][channel.id]
      }

      channel.editPermission(userId, null, null, 'member')
      return serverData
    })
  }

  static points (server, userId) {
    return persistence.getDataForServer(server.id).then(serverData => {
      let points = serverData.vevPoints
      if (!points) {
        points = {}
      }

      if (!points[userId] && points[userId] !== 0) {
        points[userId] = 420
      }

      return points[userId]
    })
  }

  static award (server, targetId, amount) {
    let remainingPoints = 0
    return persistence.editDataForServer(server.id, serverData => {
      let points = serverData.vevPoints
      if (!points) {
        points = {}
      }

      if (!points[targetId] && points[targetId] !== 0) {
        points[targetId] = 420
      }

      points[targetId] += parseInt(amount)
      remainingPoints = points[targetId]
      return serverData
    }).then(() => {
      return remainingPoints
    })
  }

  static regen (server, targetId) {
    return persistence.editDataForServer(server.id, serverData => {
      let points = serverData.vevPoints
      if (!points) {
        points = {}
      }

      if (!points[targetId] && points[targetId] !== 0) {
        points[targetId] = 420
      }

      let amount = Math.floor(Math.random() + ((420 - points[targetId]) / 420))

      points[targetId] += parseInt(amount)
      return serverData
    })
  }
}

module.exports = VevList
