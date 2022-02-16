var mongoose = require('mongoose')
const { model, Schema } = require('mongoose')
require('mongoose-double')(mongoose)
var SchemaTypes = mongoose.Schema.Types

const donateBoxSchema = new Schema({
  summa: {
    type: SchemaTypes.Double,
    default: 1000.0
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

donateBoxSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

const DonateBox = module.exports = model('DonateBox', donateBoxSchema)