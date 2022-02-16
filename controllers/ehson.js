var mongoose = require('mongoose')
const User = require('../models/user')
const EhsonBox = require('../models/ehson_box')
const Organization = require('../models/organization')

module.exports.all = async (req, res) => {
  try {
    const data = await EhsonBox.find()
    res.json(data)
  } catch (e) {
    res.status(404).json({
      message: e
    })
  }
}

module.exports.create = async (req, res) => {
  try {
    const { summa, organization, user } = req.body
    const data = new EhsonBox({ summa, organization, user })
    await data.save()
    const userData = await User.findById(user)
    userData.ehson_total += summa
    await userData.save()
    const organizationData = await Organization.findById(organization)
    organizationData.ehson_total += summa
    await organizationData.save()
    res.json(data)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.get_users = async (req, res) => {
  try {
    const { limit, offset, search, category, status, sort, organization } = req.body
    // const query = await EhsonBox.find({organization: organization})
    const result = await EhsonBox.aggregate([
      {
        $match: { organization: new mongoose.Types.ObjectId(organization) }
      },
      {
        $group: {
          _id: "$user",
          total: { $sum: "$summa" }
        }
      },
      { 
        $sort: { 
          "total": -1,
          createdAt: sort['order'] == 'ascending' ? 1 : -1 
        }
      },
      { 
        $lookup: {
          from: 'users', 
          localField: '_id', 
          foreignField:'_id',
          as: 'person'
        }
      },
      {
        $unwind: {
          path: '$person',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          total: 1,
          person: {
            name: 1,
            picture: 1,
            username: 1,
            email: 1,
            createdAt: 1,
          }
        }
      },
      {
        $limit: limit,
      },
      {
        $skip: offset
      }
    ])
    res.json(result)
  } catch (e) {
    res.status(404).json({
      message: e
    })
  }
}

module.exports.get_organizations = async (req, res) => {
  try {
    const { limit, offset, user, sort, search, category, status } = req.body
    await EhsonBox.paginate(
      { user }, {
        sort: { createdAt: sort['order'] == 'ascending' ? 1 : -1, 'summa': -1 }, 
        populate: [
          { 
            path: 'organization',
          }
        ],
        offset: offset, 
        limit: limit
    }).then((result) => {
      res.json({ data: result.docs, total: result.totalDocs })
    })
  } catch (e) {
    res.status(404).json({
      message: 'User not found!'
    })
  }
  
}
