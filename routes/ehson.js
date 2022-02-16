const { Router } = require('express')
const { all, get_users, create, get_organizations } = require('../controllers/ehson')

const router = Router()

router.get('/', all)
router.post('/create', create)
router.post('/users', get_users)
router.post('/organizations', get_organizations)

module.exports = router