const {Strategy, ExtractJwt} = require('passport-jwt')
const keys = require('../keys')
const User = require('../models/user')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.JWT
}

module.exports = new Strategy(options, async (payload, done) => {
    try {
        const candidate = await User.findById(payload.user_id).select('id')

        if (candidate) {
            done(null, candidate)
        } else {
            done(null, false)
        }
    } catch (e) {
        console.error(e)
    }
})
