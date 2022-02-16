var mongoose = require('mongoose')
const { model, Schema } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
require('mongoose-double')(mongoose)
var SchemaTypes = mongoose.Schema.Types

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: 'nologo.png'
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
	location: {
		type: { type: String, default: "Point" },
		coordinates: { type: [Number], default: [0, 0] }
	},
  status: {
    type: Number,
    default: 0,
  },
  responsible: {
    firstname: {  
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  owner: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'User'
  },
  category: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'Category'
  },
  document: {
    name: {
      type: String,
      required: true
    },
    mfo: {
      type: String,
      required: true
    },
    stir: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true,
    },
    media: [
      {
        file: {
          type: String,
          required: true
        }
      }
    ]
  },
  ehson_total: {
    type: SchemaTypes.Double,
    default: 0.0
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

organizationSchema.methods.toJSON = function () {
  var obj = this.toObject()
  obj.distance = 0.1
  delete obj.__v
  return obj
}

organizationSchema.virtual('ehsonboxes', {
    ref: 'EhsonBox',
    localField: '_id',
    foreignField: 'organization',
})

organizationSchema.plugin(mongoosePaginate)
organizationSchema.index({ location: "2dsphere" })

const Organization = module.exports = model("Organization", organizationSchema)
