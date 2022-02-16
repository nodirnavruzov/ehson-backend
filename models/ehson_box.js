var mongoose = require('mongoose')
const { model, Schema } = require('mongoose')
require('mongoose-double')(mongoose)
var SchemaTypes = mongoose.Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')

const ehsonBoxSchema = new Schema({
  summa: {
    type: SchemaTypes.Double,
    default: 1000.0
  },
  organization: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Organization'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
},{
  timestamps: true,
})

ehsonBoxSchema.plugin(mongoosePaginate)

ehsonBoxSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

const EhsonBox = module.exports = model('EhsonBox', ehsonBoxSchema)