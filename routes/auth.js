const { Router } = require('express')
const { signin, reset, updateInfo } = require('../controllers/auth')
const router = Router()

// /api/auth/*
//without jwt 
router.post('/signin', signin)
router.post('/reset', reset)
router.patch('/update-info', updateInfo)

//with jwt

module.exports = router
