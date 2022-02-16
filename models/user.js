const bcrypt = require('bcrypt')
var mongoose = require('mongoose')
const { model, Schema } = require('mongoose')
require('mongoose-double')(mongoose)
var SchemaTypes = mongoose.Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    token: {
        type: String,
        default: ''
    },
    uid: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        default: "Noma'lum"
    },
    provider: {
        type: String,
        default: ''
    },
    picture: {
        type: String,
        default: 'https://ui-avatars.com/api/?background=0D8ABC&color=fff'
    },
    ehson_total: {
      type: SchemaTypes.Double,
      default: 0.0
    },
    status: {
        type: Number,
        default: 2 // 0-admin, 1-moderator, 2-user, 3-banned
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.virtual('bookmarks', {
    ref: 'Bookmark',
    localField: '_id',
    foreignField: 'user'
})

userSchema.virtual('ehsonboxes', {
    ref: 'EhsonBox',
    localField: '_id',
    foreignField: 'user'
})

userSchema.methods.toJSON = function() {
    var obj = this.toObject()
    delete obj.__v
    delete obj.password
    return obj
}

// userSchema.virtual('bookmarks', {
//     ref: 'Bookmark',
//     localField: '_id',
//     foreignField: 'user',
//     justOne: true,
//     // count: true,
//     // match: { user: this._id }
// })

// userSchema.pre('find', function () {
//   this.populate({ path: 'bookmarks' })
// })

userSchema.plugin(mongoosePaginate)


const User = module.exports = model("User", userSchema)

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            return callback(err)
        } else {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash
                newUser.save(callback)
            })
        }
    })
}

module.exports.setPassword = function(user, newPass, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            return callback(err)
        } else {
                bcrypt.hash(newPass, salt, (err, hash) => {
                user.password = hash
                user.save(callback)
            })
        }
    })
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) return callback(err)
        callback(null, isMatch)
    })
}
