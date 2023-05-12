const {Router} = require('express');
const multer = require('multer');


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'medias');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
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
  
const {
    createProductController,
    singleProductController,
    findAllProductsController,
    deleteProductController,
    updateProductController
} = require("../controllers/productController.js");
const auth = require('../middleware/auth.js');
const hasAccess = require('../middleware/hasAccess.js');
const { ACCESS_TYPES } = require('../util/constants.js');


const router = Router();

router.post('', auth, (req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.CREATE)
},multer({ storage: fileStorage, fileFilter: fileFilter }).single('media'), createProductController);
router.get('/',  findAllProductsController); // get all
router.get('/:id', singleProductController); // get single
router.put('/:id',(req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.EDIT)
}, updateProductController); // update single
router.delete('/:id', (req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.DELETE)
}, deleteProductController);



module.exports = router