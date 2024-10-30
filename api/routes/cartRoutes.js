const express = require('express');
const Carts = require('../models/Carts'); // Adjusted the path to access Menu.js
const router = express.Router();

const cartController = require('../controllers/cartControllers')
const verifyToken = require('../middleware/verifyToken')

// get all menu items from db
router.get('/', verifyToken, cartController.getCartByEmail)
router.post('/',cartController.addToCart)
router.delete('/:id', cartController.deleteCart)
router.put('/:id', cartController.updateCart)
router.get('/:id', cartController.getSingleCart)

module.exports = router;

