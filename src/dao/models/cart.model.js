import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'carts'; 

const schema = new mongoose.Schema({

    cartId: { type: mongoose.Types.ObjectId, required: true },
    list: [{idProduct:{type: String, required: true, ref: 'product'},quantity:{ type: Number, required: true }}]

    
},{ versionKey: false });

const cartModel = mongoose.model(collection, schema); 

export default cartModel;