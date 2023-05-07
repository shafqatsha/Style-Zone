import {Router} from 'express';
import {
    createProductController,
    singleProductController,
    findAllProductsController,
    deleteProductController,
    updateProductController
} from "../controllers/productController.js";
import auth from '../middleware/auth.js';
import hasAccess from '../middleware/hasAccess.js';
import { ACCESS_TYPES } from '../util/constants.js';


const router = Router();

router.post('', auth, (req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.CREATE)
}, createProductController);
router.get('/',  findAllProductsController); // get all
router.get('/:id', singleProductController); // get single
router.put('/:id',(req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.EDIT)
}, updateProductController); // update single
router.delete('/:id', (req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.DELETE)
}, deleteProductController);



export default router