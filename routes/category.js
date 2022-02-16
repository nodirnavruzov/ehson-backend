const { Router } = require('express')
const { all, list, get, create, update } = require('../controllers/category')

const router = Router()

router.get('/', all)
router.post('/', list)
router.get('/:id', get)
router.post('/create', create)
router.put('/update/:id', update)

module.exports = router