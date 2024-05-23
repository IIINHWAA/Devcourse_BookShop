const express = require('express');
const router = express.Router();
router.use(express.json());
const {body, param, validationResult} = require('express-validator')
const {join, login, passwordResetReq, passwordReset} = require('../controller/UserController');

const validate = (req,res,next)=>{
    const err = validationResult(req)
    if(err.isEmpty()){
        return next(); 
    }
    else{
        return res.status(400).json(err.array())
    } 
}

//회원 가입
router.post('/join',[
    body('email').notEmpty().isEmail().withMessage('email 입력 오류'),
    body('name').notEmpty().isString().withMessage('name 입력 오류'),
    body('password').notEmpty().isString().withMessage('password 입력 오류'),
    validate
],join);

//로그인
router.post('/login',[
    body('email').notEmpty().isEmail().withMessage('email 오류'),
    body('password').notEmpty().isString().withMessage('password 오류'),
    validate
],login);

//비밀번호 초기화
router.post('/passwordReset',[
    body('email').notEmpty().isEmail().withMessage('email 오류'),
    validate
],passwordResetReq);

//비밀번호 재설정
router.put('/passwordReset',[
    body('password').notEmpty().isString().withMessage('password 오류'),
    validate
],passwordReset);

module.exports = router