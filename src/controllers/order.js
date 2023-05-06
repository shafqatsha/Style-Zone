import Order from "../models/Order.js";
import Product from "../models/Product.js";


export const createOrderController = async (req, res) => {
    try {
        const orderPayload = req.body;
        let products = [];
        for (const item of orderPayload.products) {
            const product = await Product.findById(item.product_id);
            products.push({
                product,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
            })
        }
        const order = new Order({
            products,
            shipping_address: orderPayload.shipping_address,
            user: req.user,
        })

        await order.save();
        res.send({
            message: "Order placed successfully",
            order,
        })
    } catch (e) {
        console.log(e)
        res.send(e)
    }
}


export const getOrdersController = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user').exec();
        res.status(200).send({
            message: "Orders fetched successfully",
            orders,
        })
    } catch (e) {
        console.log(e)
    }
}