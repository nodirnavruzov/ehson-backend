const { HeaderAPIKeyStrategy } = require('passport-headerapikey')
const keys = require('../keys')

module.exports = new HeaderAPIKeyStrategy(
    {header: 'Authorization', prefix: 'App-Key '}, false, 
    async (appKey, done) => {
        try {
            if (keys.APP_KEY === appKey) {
                done(null, true)
            } else {
                done(null, false)
            }
        } catch (e) {
            console.error(e)
            done(null, false)
        }
    }
)
