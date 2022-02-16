const Post = require('../models/post')

module.exports.list = async (req, res) => {
  try {
    const query = {}
    const { limit, offset, search, category, status, sort } = req.body
    if (status != -1) {
      query.status = status
    }
    if (category != '') {
      query.category = category
    }
    await Post.paginate(
      query, {
        sort: { createdAt: sort['order'] == 'ascending' ? 1 : -1 }, 
        populate: [
          { path: 'owner', select: ['email', 'username'] },
          { path: 'category', select: ['name', 'status'] },
        ],
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
    await Post.findById(req.params.id)
      .populate([
        { path: 'category', select: 'name' },
        { path: 'owner', select: ['email', 'username']},
      ]).then((post) => {
          res.json(post.toJSON())
      })
  } catch (e) {
    res.status(404).json({ message: 'Post not found!' })
  }
}

module.exports.create = async (req, res) => {
  try {
    const {
      title, 
      content, 
      status,
      owner, 
      address,
      category, 
      organization,
      current_total,
      total,
      media,
      latitude,
      longitude
    } = req.body

    let data = new Post({ 
      title, 
      content, 
      status,
      owner, 
      address,
      category, 
      organization,
      current_total,
      total,
      media,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(latitude),
          parseFloat(longitude)
        ]
      }
    })
    data.save((err, org) => {
      if (err) return console.log(err);
      const id = org._id
      res.json({id, message: 'Post successfully added!' })
    })
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.update = async (req, res) => {
  const _id = req.params.id
  const data = req.body
  try {
    await Post.updateOne({ _id }, { ...data }, (err, result) => {
      if (err) {
        return console.log(err)
      } else {
        res.json({ id: _id, message: 'Post successfully updated!' })
      }
    }) 
  } catch (e) {
    res.status(500).json(e)
  }
}