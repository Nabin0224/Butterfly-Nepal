const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : false
},
guestId: {
    type: String,
    required: false
},
items : [
    {
   productId :  {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        requried: true
    },
    quantity : {
        type : Number,
        required : true, 
        min : 1
    },
    color: {
        type: String
    },
    size: {
        type: String,
        required: false,
    }
}
]
}, 
{timestamps : true }
)

module.exports = mongoose.model('Cart', CartSchema)