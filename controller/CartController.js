const ensureAuthorizaion = require('../auth'); 
const conn = require('../db2');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken'); 
var dotenv = require('dotenv');
dotenv.config();

const addToCart = (req, res) =>{
    const {book_id, quantity} = req.body;
    let authorization = ensureAuthorizaion(req);
    if (authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다."
        });
    }
    else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        });
    }
    else{
        let sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)";
        let values = [book_id, quantity, authorization.id];
        executeQuery(res,sql,values);
    }
};

const getCartItems = (req, res) =>{
    const {selected} = req.body;
    let authorization = ensureAuthorizaion(req);
    if (authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다."
        })
    }
    else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        });
    }
    else{
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id=?`
        let values = [authorization.id, selected];

        if(selected){
            sql += ` AND cartItems.id IN (?)`
            values.push(selected); 
        }
    
        executeQuery(res,sql,values);
    }
};

const deleteItems = (req, res) =>{
    const cartItemId = req.params.id;
    let sql = "DELETE FROM cartItems WHERE id = ?"
    executeQuery(res,sql,cartItemId);
};

const executeQuery = (res, sql, values) => {
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(results);
    });
};

module.exports = {
    addToCart, 
    getCartItems,
    deleteItems
}