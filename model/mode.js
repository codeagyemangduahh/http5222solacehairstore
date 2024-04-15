const mongoose = require('mongoose');
//  User Schema
const userSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    signUp: {
        username: String,
        password: String,
        first_name: String,
        last_name: String,
        email: String,
        address: String,
        address2: String,
        city: String,
        zip: Number,
        auth: String
    },
    contact: {
        name: String,
        subject: String,
        phone: Number,
        email: String,
        Message: String
    },
    hairProduct: {
        hairType: String,
        price: Number
    },
    profile:{
        userid: mongoose.ObjectId,
        name: String,
        password: String,
        profPic: String
    }

});

const User = mongoose.model('User', userSchema);

module.export = User;
