const express = require('express');
const router = express.Router();
router.use(express.json());
const {order, getOrders, getOrderDetail} = require('../controller/OrderController');

//결제하기
router.post('/',order);

//주문 목록 내역 조회
router.get('/',getOrders);

//주문 상세 조회
router.get('/:id',getOrderDetail);

module.exports = router