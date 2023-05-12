const {Router} = require('express');
const {createOrderController, getOrdersController} = require("../controllers/order.js");

const router = Router();


router.post('/', createOrderController);
router.get('/', getOrdersController);

module.exports = router;