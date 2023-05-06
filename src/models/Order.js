import {Schema, model} from "mongoose";

const ORDER_SCHEMA_PROTO_ = {
    products: {
        type: [{
            product: {
                type: Object,
                required: true
            },
            size: {type: String, required: true},
            color: {type: String, required: true},
            quantity: {type:Number, required: true},
        }],
        validate: {
            validator: v => Array.isArray(v) && v.length > 0,
            message: props => `The order(s) can't be empty`
        }
    },
    shipping_address: {
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
        email: {type: String, required: true},
        address: {
            address: {type: String, required: true},
            state: {type: String, required: true},
            city: {type: String, required: true},
            postal_code: {type: String, required: true},
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}

const orderSchema = new Schema(ORDER_SCHEMA_PROTO_);

export default model('Order', orderSchema);