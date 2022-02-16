
const User = require('../models/user')

module.exports.list = async (req, res) => {
  try {
    const query = {}
    const { limit, offset, search, category, status, sort } = req.body
    await User.paginate(
      query, {
        sort: { createdAt: sort['order'] == 'ascending' ? 1 : -1 }, 
        offset: offset, 
        limit: limit
    }).then((result) => {
      res.json({ data: result.docs, total: result.totalDocs })
    })
  } catch (e) {
    res.status(404).json({ message: e })
  }
}

module.exports.get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate([
        { 
          path: 'ehsonboxes',
          populate: {
            path: 'organization',
            model: 'Organization',
            select: 'name logo address'
          },
          select: '-createdAt -updatedAt -__v -_id'
        },
        { 
          path: 'bookmarks', 
          populate: {
            path: 'organization',
            model: 'Organization',
            select: 'name logo address'
          },
          select: '-createdAt -updatedAt -__v -_id'
        }
      ])
    res.json(user.toJSON())
  } catch (e) {
    res.status(404).json({ message: 'User not found!' })
  }
}

module.exports.user = async (req, res) => {
  const { user_id } = req.body
  try {
      const user = await User.findById(user_id)
      res.json({ user: user.toJSON() })
  } catch (e) {
      res.status(404).json({ message: 'User not found!' })
  }
}

module.exports.me = async (req, res) => {
  const { uid } = req.body
  try {
    const user = await User.findOne({ uid: uid })
    res.json({ data: user.toJSON() })
  } catch (e) {
    res.status(404).json({ message: 'User not found!' })
  }
}

module.exports.create = async (req, res) => {
  try {
    const { uid, username, email, password, picture } = req.body
    
    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(409).json({ message: 'User already exists'})
    } else {
      let newUser = new User({ uid, username, email, password, picture })
      await User.addUser(newUser, (err, user) => {
        if(err) {
          res.status(422).json({ message: 'Failed to create user.' + err })
        }
        res.json({ message: 'User successfully added!' })
      })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}