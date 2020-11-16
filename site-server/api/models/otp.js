const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
    otp: {
        type: String ,
        required: true 
    } ,
    email: {
        type: String,
        required: true
    }
},{
    timestamps: true 
}
);

const Otp = mongoose.model('Otp',otpSchema);

module.exports = Otp ;