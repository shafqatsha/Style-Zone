import mongoose from 'mongoose';

const {Schema} = mongoose;

const PRODUCT_SCHEMA_PROTO_ = {
    name: {
        type: String,
        minLength: [3, 'Must be at least 3, got {VALUE}'],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sizes: {
        type: [{
            size: {type: String, required: true},
            quantity: {type: Number, required: true}
        }],
        validate: {
            validator: v => Array.isArray(v) && v.length > 0,
            message: props => `The sizes array can't be empty`
        },
    },
    quality: {
        type: String,
        required: true
    },
    is_on_sale: {
        type: Boolean,
        required: true
    },
    regular_price: {
        type: Number,
        required: true
    },
    sale_price: {
        type: Number,
        required: function () {
            return this.is_on_sale == true
        }
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}

const productSchema = new Schema({
    ...PRODUCT_SCHEMA_PROTO_
})

export default mongoose.model('Product', productSchema);
export {PRODUCT_SCHEMA_PROTO_}
