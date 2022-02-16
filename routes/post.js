const { Router } = require('express')
const { list, create, get, update } = require('../controllers/post')

const router = Router()

router.post('/', list)
router.get('/:id', get)
router.post('/create', create)
router.put('/update/:id', update)
// router.put('/delete/:id', remove)

module.exports = router