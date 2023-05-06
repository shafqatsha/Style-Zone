import {Router} from 'express';
import {
    createProductController,
    singleProductController,
    findAllProductsController,
    deleteProductController,
    updateProductController
} from "../controllers/productController.js";
import auth from '../middleware/auth.js';


const router = Router();

router.post('', auth, createProductController);
router.get('/', findAllProductsController); // get all
router.get('/:id', singleProductController); // get single
router.put('/:id', updateProductController); // update single
router.delete('/:id', deleteProductController);



export default router