const { model, Schema } = require('mongoose')

const bookmarkSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Organization'
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  { timestamps: true }
)
  
const Bookmark = module.exports = model('Bookmark', bookmarkSchema)
