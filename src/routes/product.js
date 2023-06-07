const {Router} = require('express');
const multer = require('multer');

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
const  mediaUpload  = require('../util/composables/multer.js');


const router = Router();

router.post('', auth, (req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.CREATE)
},mediaUpload.single('media'), createProductController);
router.get('/',  findAllProductsController); // get all
router.get('/:id', singleProductController); // get single
router.put('/:id',(req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.EDIT)
}, updateProductController); // update single
router.delete('/:id', (req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.DELETE)
}, deleteProductController);



module.exports = router