const { model, Schema } = require('mongoose')

const OrganizationCategoriesSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Organization'
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  }
})

const OrganizationCategories = module.exports = model('OrganizationCategories', OrganizationCategoriesSchema)
