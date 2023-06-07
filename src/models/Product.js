const mongoose =  require('mongoose');

const {Schema} = mongoose;

 const PRODUCT_SCHEMA_PROTO_ = {
    name: {
        type: String,
        minLength: [3, 'Must be at least 3, got {VALUE}'],
        required: true
    },
    categories: {
        type: [String],
        required: false
    },
    color: {
        type: String,
        required: false
    },
    season: {
        type: String,
        required: false
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
            validator: (v) => {
                if(!v) return false;
                return Array.isArray(v) && v.length > 0
            },
            message: props => `The sizes array can't be empty Or invalid value provided ${props} `
        },
    },
    
    medias: {
        type: [{
            media: {type: String, required: true},
            media_url: {type: String, required: true}
        }],
        validate: {
            validator: (v) => {
                if(!v) return false;
                return Array.isArray(v) && v.length > 0
            },
            message: props => `The medias field can't be empty Or invalid value provided`
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
}, { timestamps: true })

module.exports =  {Product: mongoose.model('Product', productSchema), PRODUCT_SCHEMA_PROTO_}
// exports. = PRODUCT_SCHEMA_PROTO_
