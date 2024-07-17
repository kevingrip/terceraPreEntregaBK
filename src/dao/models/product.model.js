import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);

const collection = 'product'; 

const schema = new mongoose.Schema({

    title: { type: String, required: true },

    category: { type: String, enum:['Vacio','Frenos','Escapes','Asientos','Estatores','Reguladores'], default: 'Vacio' },

    description: { type: String, required: false },

    price: { type: Number, required: true },

    thumbnail: { type: String, required: false },

    code: {type: String, required: true},

    stock: {type: Number, required: true},

    status: {type: Boolean, required: true},

    id: {type: Number, required: true}

},{ versionKey: false });

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, schema); 

export default productModel;