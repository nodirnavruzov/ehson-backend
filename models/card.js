const {model, Schema} = require('mongoose')

const cardSchema = new Schema({
  number: {
    type: String,
    required: true
  },
  expire: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

cardSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

const Card = module.exports = model("Card", cardSchema)
