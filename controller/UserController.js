const conn = require('../db2');
const jwt = require('jsonwebtoken'); 
const {StatusCodes} = require('http-status-codes');
const crypto = require('crypto')

const join = (req,res,next)=>{
    const{email,name, password} = req.body

    const salt = crypto.randomBytes(64).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

    let sql = 'INSERT INTO users (email, name, password, salt) VALUES (?,?,?,?)';
    let values = [email, name, hashPassword, salt];
    conn.query(sql, values, (err, results)=>{
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(results.affectedRows){
            res.status(StatusCodes.CREATED).json(results);
        }
        else{
            res.status(StatusCodes.BAD_REQUEST).end();
        }
    })
};

const login =  (req,res,next)=>{
    let {email, password} = req.body
    let sql = 'SELECT * FROM `users` WHERE email = ?';
    let values = email;
    conn.query(
        sql,values, (err, results)=>{
            var loginUser = results[0];
            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 64, 'sha512').toString('base64');


            if (loginUser && loginUser.password == hashPassword){
                const token = jwt.sign({
                    id : loginUser.id,
                    email : loginUser.email,
                    name : loginUser.name
                }, process.env.PRIVATE_KEY,{
                    expiresIn : '60m',
                    issuer : 'inhwa'
                });

                res.cookie('token', token, {
                    httpOnly : true
                });

                res.status(StatusCodes.OK).json({
                    message : "로그인 되었습니다.",
                    token : "토큰 발급 확인"
                })

                console.log(token);
            }
            else{
                res.status(StatusCodes.BAD_REQUEST).json({
                    message : '아이디 또는 비밀번호 오류'
                })
            }
        }
    )

};

const passwordResetReq = (req,res)=>{
    const {email} = req.body;
    let sql = 'SELECT * FROM users WHERE email = ?';
    let value = email;
    conn.query(sql, value,(err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        const user = results[0];
        if (user){
            return res.status(StatusCodes.OK).json({
                email : email,
            });
        }
        else{
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    })
};

const passwordReset = (req,res)=>{
    const {email, password} = req.body;
    let sql = 'UPDATE users SET password = ?, salt =? WHERE email = ?';
    const salt = crypto.randomBytes(64).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    
    let values = [hashPassword,salt,email];
    conn.query(sql, values,(err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (results.affectedRows==0){
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        else{
            return res.status(StatusCodes.OK).json(results);
        }
    })
};

module.exports = {
    join, 
    login, 
    passwordResetReq, 
    passwordReset
};