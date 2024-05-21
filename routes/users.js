const express = require('express');
const router = express.Router();
router.use(express.json());

//회원 가입
router.post('/join', (req,res)=>{

});

//로그인
router.post('/login', (req,res)=>{

});

//비밀번호 초기화
router.post('/reset', (req,res)=>{

});

//비밀번호 재설정
router.put('/reset', (req,res)=>{

});

module.exports = router