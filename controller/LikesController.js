const ensureAuthorizaion = require('../auth'); 
const conn = require('../db2');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken'); 
var dotenv = require('dotenv');
dotenv.config();

const addLike = (req, res) =>{
    const book_id = req.params.id;
    let decodedJwt = ensureAuthorizaion(req);
    if (decodedJwt instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다."
        })
    }
    else if (decodedJwt instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        });
    }
    else{
        let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
        let values = [decodedJwt.id, book_id]
        conn.query(sql,values,(err, results)=>{
            if (err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
    }
};

const deleteLike = (req, res) =>{
    const book_id = req.params.id;
    let decodedJwt = ensureAuthorizaion(req);
    if (decodedJwt instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다."
        })
    }
    else if (decodedJwt instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        });
    }
    else{
        let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?"
        let values = [decodedJwt.id, book_id]
        conn.query(sql,values,(err, results)=>{
            if (err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
    }
};


module.exports = {
    addLike, 
    deleteLike,
}