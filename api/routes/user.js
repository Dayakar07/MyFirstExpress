const express = require('express');
const router = express.Router();
const authCheck = require('./../auth/auth');
const userController = require('./../controllers/user');

router.get("/", authCheck, userController.get_all_users);

router.get("/:id", authCheck, userController.get_user);

router.post("/signup", userController.sign_up);

router.post("/login", userController.sign_in);

router.delete("/:id", authCheck, userController.delete_user);

module.exports = router;