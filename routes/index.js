const passport = require('passport')
const { Router } = require('express')
const fs = require("fs");
const path = require("path");

const authRoutes = require('./auth')
const cardRoutes = require('./card')
const userRoutes = require('./user')
const mobileRoutes = require('./mobile')
const categoryRoutes = require('./category')
const organizationRoutes = require('./organization')
const postRoutes = require('./post')
const ehsonRoutes = require('./ehson')

const upload = require('../middleware/image-upload')

const router = Router()

// declare routes 
router.use('/auth', authRoutes)
router.use('/card', cardRoutes)
router.use('/users', passport.authenticate('jwt', {session: false}), userRoutes)
router.use('/organization', passport.authenticate('jwt', {session: false}), organizationRoutes)
router.use('/post', passport.authenticate('jwt', {session: false}), postRoutes)
router.use('/category', passport.authenticate('jwt', {session: false}), categoryRoutes)
router.use('/ehson',passport.authenticate('jwt', {session: false}), ehsonRoutes)

router.use('/v1', passport.authenticate('headerapikey', {session: false}), mobileRoutes)

router.post('/upload', passport.authenticate('jwt', {session: false}), upload.single('file'), (req, res) => {
    res.json({file: req.file.filename, path: req.file.path})
})

router.post('/remove-image', passport.authenticate('jwt', {session: false}), (req, res) => {
    const files = req.body
    try {
        files.forEach(file => {
            fs.unlink(path.resolve(__dirname, '../', 'static/images', file), function(err){
                if (err) {
                    console.log(err);
                } else {
                    res.json({ message: 'File successfully deleted' })
                }
            });
        });
    } catch (error) {
        res.status(404).json({ message: 'Organization not found!' })
    }
})

module.exports = router