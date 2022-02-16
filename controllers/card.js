const Card = require('../models/card')

module.exports.list = async (req, res) => {
    try {
        const cards = await Card.find()
        res.json({ cards })
    } catch (e) {
        res.status(404).json({ message: e })
    }
}

module.exports.get = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id)
        res.json(card.toJSON())
    } catch (e) {
        res.status(404).json({ message: 'Card not found!' })
    }
}

module.exports.create = async (req, res) => {
    try {
        const { number, expire, ownerId} = req.body
        const cardNumberExists = await Card.findOne({ number })
        if (cardNumberExists) {
            res.status(409).json({ message: 'Card already exists'})
        } else {
            let newCard = new Card({ number, expire, ownerId })
            newCard.save((err) => {
                if (err) return console.log(err);
                res.json({ message: 'Card successfully added!' })
            });
        }
    } catch (e) {
        res.status(500).json(e)
    }
}

module.exports.update = async (req, res) => {
    try {
        const { ownerId, newCard } = req.body
        const res = await Card.updateOne({ownerId}, {newCard}, (err, result) => {
            if (err) {
                return console.log(err)
            } else {
                res.json({ message: 'Card successfully updated!' })
            }
        })
    } catch (e) {
        res.status(500).json(e)
    }
}