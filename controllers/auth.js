const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const keys = require('../keys')
const User = require('../models/user')
const helpers = require('../helpers')

module.exports.signin = async (req, res) => {
    try {
        const candidate = await User.findOne({email: req.body.email})
        if (candidate) {
            if (candidate.status > 0) {
                res.status(401).json({message: 'Your account has not been verified!' })
            }
            const correct = bcrypt.compareSync(req.body.password, candidate.password)
            if (correct) {
                const token = jwt.sign({
                                    email: candidate.email,
                                    user_id: candidate._id
                                }, keys.JWT, {expiresIn: "30d"})
                res.json({token, user: candidate.toJSON()})
            } else {
                res.status(401).json({message: 'User email or password wrong!' })
            }
        } else {
            res.status(404).json({message: 'User not found!' })
        }
    } catch (error) {
        res.status(500).json(e)
    }
}

module.exports.signup = async (req, res) => {
    const { email, status, uid, name, username, provider, picture } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.json({ data: userExists.toJSON() })
    } else {
        let newUser = new User({ 
            uid: uid,
            name: name,
            email: email,
            status: status,
            picture: picture,
            username: username,
            provider: provider,
            password: helpers.genUnique(8)
        })
        User.addUser(newUser, async (err, user) => {
            if(err) {
                console.error('new user error', email, uid);
                // res.status(422).json({ message: 'Failed to register user.' + err })
            } else {
                await user.save()
                res.json({ data: user.toJSON() })
            }
        })
    }
}

module.exports.reset = async (req, res) => {
    const {id, currentPassword, newPassword, } = req.body
    try {
        const candidate = await User.findOne({ _id: id })
        console.log('req.body', req.body)
        if (candidate) {
            const correct = bcrypt.compareSync(currentPassword, candidate.password)
            if (correct) {
                    User.setPassword(candidate, newPassword, (err, user) => {
                        console.log('user', user)
                        if(err) 
                            res.status(500).json({ message: 'Server error!' })
                        res.json({ message: 'User password has been updated!' })
                    })
            } else {
                res.status(401).json({message: 'User email or password wrong!' })
            }
        } else {
            res.status(404).json({message: 'User not found!' })
        }
    } catch (error) {
        res.status(500).json(e)
    }
}

module.exports.updateInfo = async (req, res) => {
    try {
        const { email, name, username, picture } = req.body
        console.log('updateInfo', req.body)
        await User.updateOne({ email }, { name, username, picture }, (err, result) => {
            if (err) {
                return console.log(err)
            } else {
                res.json({ message: 'User successfully updated!' })
            }
        })
    } catch (error) {
        res.status(500).json(e)
    }
}
