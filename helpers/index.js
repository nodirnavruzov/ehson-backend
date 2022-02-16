
const keys = require('../keys')
const jwt = require('jsonwebtoken')

function getAuthUserId(params) {
    const bearer = params.split(' ')
    const token = bearer[1]
    const { userId } = jwt.verify(token, keys.JWT)
    return userId
}

function genUnique(len) {
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var rtn = ''
    for (var i = 0; i < len; i++) {
      rtn += str.charAt(Math.floor(Math.random() * str.length))
    }
    return rtn
}

exports.genUnique = genUnique
exports.getAuthUserId = getAuthUserId
