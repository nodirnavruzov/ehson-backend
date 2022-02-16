var mongoose = require('mongoose')
const { model, Schema } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
require('mongoose-double')(mongoose)
var SchemaTypes = mongoose.Schema.Types

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  owner: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'User'
  },
  address: {
    type: String,
    required: true,
  },
  category: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'Category'
  },
  organization: { 
    type: Schema.Types.ObjectId, 
    required: false, 
    ref: 'Organization'
  },
  current_total: {
    type: SchemaTypes.Double,
    default: 0.0
  },
  total: {
    type: SchemaTypes.Double,
    default: 0.0
  },
	location: {
		type: { type: String, default: "Point" },
		coordinates: { type: [Number], default: [0, 0] }
	},
  media: [
    {
      file: {
        type: String,
        required: true
      }
    }
  ]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})

postSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

postSchema.virtual('donateboxes', {
    ref: 'DonateBox',
    localField: '_id',
    foreignField: 'post',
})

postSchema.plugin(mongoosePaginate)
postSchema.index({ location: "2dsphere" })

const Post = module.exports = model("Post", postSchema)
