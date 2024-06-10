const ensureAuthorizaion = require('../auth'); 
const jwt = require('jsonwebtoken');
const conn = require('../db2');
const {StatusCodes} = require('http-status-codes');

const getBooks = (req, res) =>{    
    let {categoryId, news, limit, currentPage} = req.query;
    let offset = limit * (currentPage-1);
    let allBooksRes = {};

    let sql = 'SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books';
    let values = [];

    if(categoryId && news){
        sql += ' WHERE categoryId=? AND pubDate BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        console.log(sql, categoryId, news)
        values = [categoryId];
    }else if(categoryId){
        sql += ' WHERE categoryId = ?';
        values = [categoryId];
    } else if(news){
        sql += 'WHERE pubDate BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    }
    
    sql += ' LIMIT ? OFFSET ?';
    values.push(parseInt(limit), offset);

    conn.query(sql,values, (err, results)=>{
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results.length){
            allBooksRes.books = results;
            getTotalCount(res, currentPage, allBooksRes);
        }
        else { return res.status(StatusCodes.NOT_FOUND).end(); }
    })
};

const getBook = (req, res) =>{
    let authorization = ensureAuthorizaion(req);
    let book_id = req.params.id;
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
    else if (authorization instanceof ReferenceError){
        let sql = `SELECT *,
	            (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes
                FROM books
                LEFT JOIN category
                ON books.categoryId = category.categoryId
                WHERE books.id=?;`;
        let values = [book_id]            
        conn.query(sql,values,(err, results)=>{
            if(err){
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            else{
                return res.status(StatusCodes.OK).json(results);
            }
        });
    }
    else{
        let sql = `SELECT *,
	            (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
	            (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) 
                AS liked FROM books
                LEFT JOIN category
                ON books.categoryId = category.categoryId
                WHERE books.id=?;`;
    
        let values = [authorization.id, book_id, book_id]            
        conn.query(sql,values,(err, results)=>{
            if(err){
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            else{
                return res.status(StatusCodes.OK).json(results);
            }
        });
    }
};

const getTotalCount = (res, currentPage, allBooksRes) => {
    let sql = 'SELECT FOUND_ROWS()';
    conn.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        let pagination = {
            currentPage: currentPage,
            totalCount: results[0]["FOUND_ROWS()"]
        };
        allBooksRes.pagination = pagination;
        return res.status(StatusCodes.OK).json(allBooksRes);
    });
};


module.exports = {
    getBooks, 
    getBook,
}