const Bookmark = require('../models/bookmark')

module.exports.all = async (req, res) => {
  try {
    const data = await Bookmark.find()
    res.json(data)
  } catch (e) {
    res.status(404).json({
      message: e
    })
  }
}

module.exports.create = async (req, res) => {
  try {
    const { user, organization } = req.body
    const bookmark = await Bookmark.findOne({
      user: user,
      organization: organization
    })

    if (bookmark) {
      await bookmark.remove()
      return res.status(200).json({ success: true, data: {} })
    } else {
      bookmark = await Bookmark.create({
        user: user,
        organization: organization
      })
      return res.status(200).json({ success: true, data: data })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.check = async (req, res) => {
  try {
    const { user, organization } = req.body
    const bookmark = await Bookmark.findOne({
      user: user,
      organization: organization
    })
    return res.status(200).json(!!bookmark)
  } catch (e) {
    return res.status(200).json(false)
  }
}

module.exports.organizations = async (req, res) => {
  try {
    const { user } = req.body
    const data = await Bookmark.find({user: user}).populate({
      path: 'organization',
      populate: [
        { path: 'owner', select: ['email', 'username'] },
        { path: 'category', select: ['name', 'status'] },
        { 
          path: 'ehsonboxes',
          populate: {
            path: 'user',
            model: 'User',
            select: 'name picture'
          },
          options: { sort: { 'summa': -1} },
          select: '-createdAt -updatedAt -__v -_id'
        }
      ]
    })
    res.json(data)
  } catch (e) {
    res.status(404).json({
      message: 'User not found!'
    })
  }
}