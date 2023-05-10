import {Router} from 'express';
import multer from 'multer';


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'medias');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
const upload = multer({ storage: fileStorage, fileFilter: fileFilter })

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
},upload.single('media'), createProductController);
router.get('/',  findAllProductsController); // get all
router.get('/:id', singleProductController); // get single
router.put('/:id',(req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.EDIT)
}, updateProductController); // update single
router.delete('/:id', (req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.DELETE)
}, deleteProductController);



export default router