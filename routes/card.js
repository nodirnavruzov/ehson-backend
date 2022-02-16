const { Router } = require('express')
const { list, get, create, update } = require('../controllers/card')

const router = Router()

router.get('/', list)
router.get('/:id', get)
router.post('/create', create)
router.patch('/update', update)

module.exports = router