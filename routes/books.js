const express = require('express');
const router = express.Router();
router.use(express.json());
const {getBooks, getBook, getCategory} = require('../controller/BookController');

//도서 조회
router.get('/', getBooks);

//도서 개별 조회
router.get('/:id', getBook);

module.exports = router