// @ts-nocheck
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }, 
  phoneNumber: {
    type: Number,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  wallet: { 
    type: Schema.Types.ObjectId,
    ref: 'Wallet' 
  }, // Reference to the Wallet
  createdAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAdmin:{
   type:Boolean,
   default:false
  }
});

//encrypting password
UserSchema.pre("save", async function (next) {  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


UserSchema.methods.createjwt = function () {
  // @ts-ignore
  return jwt.sign(
    { userId: this._id, name: this.firstname, isAdmin: false },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFESPAN },
  );
};

///checking if the user password is correct for the login using bcrypt.compare
UserSchema.methods.checkpassword = async function (userpassword) {
  const passwordmatch = await bcrypt.compare(userpassword, this.password);
  return passwordmatch;
};


module.exports = mongoose.model('User', UserSchema);
