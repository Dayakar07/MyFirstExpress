const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authCheck = require('./../auth/auth');
const productController = require('./../controllers/product');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, (new Date().toISOString() + file.originalname).replace(/:/g, '-'));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error("Please input only images"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get("/", productController.get_all_products);

router.get("/:id", productController.get_product_byId);

router.post("/", authCheck, upload.single('productImage'), productController.post_product);

router.patch("/:id", authCheck, productController.update_product);

router.delete("/:id", authCheck, productController.delete_product);

module.exports = router;