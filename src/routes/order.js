import {Router} from 'express';
import {createOrderController, getOrdersController} from "../controllers/order.js";

const router = Router();


router.post('/', createOrderController);
router.get('/', getOrdersController);

export default router;