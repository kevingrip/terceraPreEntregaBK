import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import cartModel from './cart.model.js';

mongoose.pluralize(null);

const collection = 'user'; 

const schema = new mongoose.Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true, index: false },
    email: { type: String, required: true },
    age: { type: Number, default: null },
    password: { type: String, required: true },
    // cart: { type: mongoose.Types.ObjectId, ref: "carts" },
    role: { type: String, enum: ['admin', 'premium', 'usuario'], default: 'usuario' },

},{ versionKey: false });

// schema.pre('find', function () {
//     this.populate({ path: 'cartId', model: cartModel });
// });

schema.plugin(mongoosePaginate);

const userModel = mongoose.model(collection, schema); 

export default userModel;