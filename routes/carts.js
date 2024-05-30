const express = require('express');
const router = express.Router();
router.use(express.json());
const {addToCart, getCartItems, deleteItems} = require('../controller/CartController');

//장바구니 담기
router.post('/', addToCart);

//장바구니 조회 (선택된 항목)
router.get('/', getCartItems);

//장바구니 삭제
router.delete('/:id', deleteItems);

module.exports = router