
const { Router } = require('express')
const { me, get, list, create, user } = require('../controllers/user')

const router = Router()

router.post('/', list)
router.post('/me', me)
router.post('/user', user)
router.get('/:id', get)
router.post('/create', create)

module.exports = router