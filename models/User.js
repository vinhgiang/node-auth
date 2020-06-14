const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refresh_token: { type: String }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Hide sensitive and unnecessary fields
UserSchema.set('toJSON', {
  transform: function(doc, ret, opt) {
    delete ret['password'];
    delete ret['__v'];
    return ret
  }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;