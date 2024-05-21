const express = require('express');
const router = express.Router();
router.use(express.json());

//전체 도서 조회
router.get('/', (req,res)=>{

});

//도서 개별 조회
router.get('/:id', (req,res)=>{

});

//카테고리 별 도서 조회
router.get('/', (req,res)=>{

});

module.exports = router