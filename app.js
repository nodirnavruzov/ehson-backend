const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

const passportStrategy = require('./middleware/passport-strategy')
const passportAppkey = require('./middleware/passport-appkey')

const keys = require('./keys')
const routes = require('./routes')

mongoose.connect(keys.MONGO_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDb connected..'))
    .catch( error => console.error(error))

app.use(passport.initialize())
passport.use(passportStrategy)
passport.use(passportAppkey)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors())
app.use(express.static('static'))

// main routes
app.use('/api', routes)

// index route
app.use('/', (req, res) => {
    res.json({message: 'Have you lost anything?'})
})

// any routes that does not match above
app.get("*", (req, res) => {
  res.status(404).json({ message: "Route Not Found." })
})

app.listen(keys.PORT, () => console.log(`Server listening on port ${keys.PORT}!`))
