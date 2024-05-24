const express = require('express');
const router = express.Router();
router.use(express.json());
const {getCategory} = require('../controller/CategoryController');

//카테고리 전체 조회
router.get('/', getCategory);

module.exports = router