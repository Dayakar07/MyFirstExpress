const express = require('express');
const router = express.Router();
const orderControllers = require('./../controllers/order');

router.get("/", orderControllers.get_all_orders);

router.get("/:id", orderControllers.get_order_byId);

router.post("/", orderControllers.post_order);

router.patch("/:id", orderControllers.update_order);

router.delete("/:id", orderControllers.delete_order);


module.exports = router;