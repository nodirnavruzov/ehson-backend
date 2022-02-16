
const Organization = require('../models/organization')

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
    await Organization.paginate(
      query, {
        sort: { createdAt: sort['order'] == 'ascending' ? 1 : -1 }, 
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

module.exports.nearby = async (req, res) => {
  try {
    const { latitude, longitude } = req.body
    await Organization.aggregate([
      {
          $geoNear: {
              near: {
                type:'Point',
                coordinates: [
                  parseFloat(latitude),
                  parseFloat(longitude)
                ]
              },
              distanceField: "distance",
              maxDistance: 3000,
              spherical: true                
          }
      },
      {
        $sort: { distance: 1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: {
          path: '$owner',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          email: 1,
          phone: 1,
          media: 1,
          status: 1,
          address: 1,
          location: 1,
          document: 1,
          distance: 1,
          updatedAt: 1,
          createdAt: 1,
          description: 1,
          ehson_total: 1,
          responsible: 1,
          category: {
            _id: 1,
            name: 1,
            status: 1
          },
          owner: {
            _id: 1,
            name: 1,
            picture: 1,
            username: 1,
            email: 1,
            createdAt: 1,
          }
        }
      }
    ]).then(function(data){
      res.send(data)
    })
  } catch (e) {
    res.status(404).json({ message: e })
  }
}

module.exports.get = async (req, res) => {
  try {
    await Organization.findById(req.params.id)
      .populate([
        { path: 'category', select: 'name' },
        { path: 'owner', select: ['email', 'username']},
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
      ]).then((organization) => {
          res.json(organization.toJSON())
      })
  } catch (e) {
    res.status(404).json({ message: 'Organization not found!' })
  }
}

module.exports.create = async (req, res) => {
  try {
    const { 
      name, 
      logo, 
      email,
      address, 
      phone,
      description, 
      status,
      responsible,
      owner, 
      category,
      document,
      media,
      longitude,
      latitude
    } = req.body
    const exists = await Organization.findOne({ name })
    if (exists) {
      res.status(409).json({ message: 'Organization already exists'})
    } else {
      let data = new Organization({ 
        name, 
        logo, 
        email,
        address, 
        phone,
        description, 
        status,
        category,
        responsible,
        owner, 
        document,
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
        res.json({id, message: 'Organization successfully added!' })
      })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.update = async (req, res) => {
  const _id = req.params.id
  const data = req.body
  try {
    await Organization.updateOne({ _id }, { ...data }, (err, result) => {
      if (err) {
        return console.log(err)
      } else {
        res.json({ id: _id, message: 'Organization successfully updated!' })
      }
    }) 
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.updated = async (req, res) => {
  const datas = await Organization.find()
  // datas.forEach((data) => {
  //   data.location = { type: "Point", coordinates: [parseFloat(data.latitude), parseFloat(data.longitude)] }
  //   data.save()
  // })
  res.json(datas)
}

module.exports.remove = async (req, res) => {
  const _id = req.params.id
  const data = req.body
  data.status = 0
  try {
    await Organization.updateOne({ _id }, { ...data }, (err, result) => {
      if (err) {
        return console.log(err)
      } else {
        res.json({ message: 'Organization successfully deleted!' })
      }
    }) 
  } catch (e) {
    res.status(500).json(e)
  }
}
