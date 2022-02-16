const Category = require('../models/category')

module.exports.all = async (req, res) => {
  try {
    const categories = await Category.find({
      status: 1
    })
    res.json(categories)
  } catch (e) {
    res.status(404).json({
      message: e
    })
  }
}

module.exports.list = async (req, res) => {
  try {
    const query = {}
    const { limit, offset, search, status, sort } = req.body
    if (status != -1) {
      query.status = status
    }
    await Category.paginate(query, {
      sort: {
        createdAt: sort['order'] == 'ascending' ? 1 : -1
      },
      offset: offset,
      limit: limit
    }).then((result) => {
      res.json({
        data: result.docs,
        total: result.totalDocs
      })
    })
  } catch (e) {
    res.status(404).json({
      message: e
    })
  }
}

module.exports.get = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    res.json(category.toJSON())
  } catch (e) {
    res.status(404).json({
      message: 'User not found!'
    })
  }
}

module.exports.create = async (req, res) => {
  try {
    const { name, status } = req.body
    const exists = await Category.findOne({ name })
    if (exists) {
      res.status(409).json({
        message: 'Category already exists'
      })
    } else {
      let data = new Category({ name, status })
      data.save((err) => {
        if (err) return console.log(err);
        res.json({
          message: 'Category successfully added!'
        })
      });
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.update = async (req, res) => {
  const _id = req.params.id
  const data = req.body

  try {
    await Category.updateOne({ _id }, {
      ...data
    }, (err, result) => {
      if (err) {
        return console.log(err)
      } else {
        res.json({
          message: 'Category successfully updated!'
        })
      }
    })
  } catch (e) {
    res.status(500).json(e)
  }
}