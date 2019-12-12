const { Schema, model } = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true
    },
    name: String,
    lastName: String,
    user: {
    type: String,
    unique: true
    },
    edad: Number,
    estatura: Number,
    peso: Number,
    GEB: Number
  },
  {
    timestamps: true,
    versionKey: false
  }
)


userSchema.plugin(PLM, { usernameField: 'email' })
module.exports = model('User', userSchema)
