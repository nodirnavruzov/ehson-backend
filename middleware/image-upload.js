const fs = require('fs')
const path = require('path')
const multer = require('multer')
const moment = require('moment')
const crypto = require('crypto')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.resolve(__dirname, '../', 'static/images'))
    },
    filename(req, file, cb) {
        let fileExtension = file.originalname.split('.')[1]
        let fileName = crypto.randomBytes(18).toString('hex') + '.' + fileExtension
        if (fs.existsSync(path.join(path.resolve(__dirname, '../', 'static/images'), fileName))) {
            fileName = `${moment().format('DDMMYYYYHHmmssSSS')}.${fileExtension}`
        }
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage, fileFilter, limits: {fileSize: 1024 * 1024 * 16}
})
