const { Router } = require('express')

const ehsonRoutes = require('./ehson')

const user = require('../controllers/user')
const bookmark = require('../controllers/bookmark')

const { signup } = require('../controllers/auth')
const { all } = require('../controllers/category')
const { list, nearby, updated } = require('../controllers/organization')

const upload = require('../middleware/image-upload')

const router = Router()

router.use('/ehson', ehsonRoutes)

router.post('/me', user.me)
router.get('/:id', user.get)
router.get('/category/all', all)
router.post('/organization', list)
router.post('/auth/signup', signup)
router.post('/organization/nearby', nearby)
router.post('/organization/updated', updated)
router.post('/bookmark', bookmark.create)
router.post('/bookmark/check', bookmark.check)
router.post('/bookmark/organizations', bookmark.organizations)

router.post('/upload', upload.single('file'), (req, res) => {
    res.json({file: req.file.filename})
})

module.exports = router
