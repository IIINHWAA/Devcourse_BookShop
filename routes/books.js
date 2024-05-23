const express = require('express');
const router = express.Router();
router.use(express.json());
const {getBooks, getBook, getBookCategory} = require('../controller/BookController');


//전체 도서 조회
router.get('/', getBooks);

//도서 개별 조회
router.get('/:id', getBook);

//카테고리 별 도서 조회
router.get('/', getBookCategory);

module.exports = router