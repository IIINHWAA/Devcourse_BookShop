const conn = require('../db');
const {StatusCodes} = require('http-status-codes');


const getBooks = (req, res) =>{
    let {categoryId, news, limit, currentPage} = req.query;
    let offset = limit * (currentPage-1);

    let sql = 'SELECT * FROM books';
    let values = [];

    if(categoryId && news){
        sql += ' WHERE categoryId=? AND pubDate BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        console.log(sql, categoryId, news)
        values = [categoryId];
    }
    else if(categoryId){
        sql += ' WHERE categoryId = ?';
        values = [categoryId];
    } 
    else if(news){
        sql += 'WHERE pubDate BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    }
    sql += ' LIMIT ? OFFSET ?';
    values.push(parseInt(limit), offset);
    conn.query(sql,values, (err, results)=>{
        if(err){
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        else{
            return res.status(StatusCodes.OK).json(results);
        }
    })
};

const getBook = (req, res) =>{
    let sql = `SELECT * FROM books LEFT JOIN category 
    ON books.categoryId = category.id WHERE books.id = ?`;
    let {id} = req.params;
    id = parseInt(id);
    
    conn.query(sql,id,(err, results)=>{
        if(err){
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        else{
            return res.status(StatusCodes.OK).json(results);
        }
    })

};


module.exports = {
    getBooks, 
    getBook,
}