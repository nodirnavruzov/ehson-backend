var mongoose = require('mongoose')
const {model, Schema} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
require('mongoose-double')(mongoose)

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

categorySchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

categorySchema.plugin(mongoosePaginate)


const Category = module.exports = model("Category", categorySchema)
