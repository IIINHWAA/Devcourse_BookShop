const conn = require('../db2');
const {StatusCodes} = require('http-status-codes');


const getBooks = (req, res) =>{
    let {categoryId, news, limit, currentPage} = req.query;
    let offset = limit * (currentPage-1);

    let sql = 'SELECT *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books';
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
    let {user_id} = req.body;
    let book_id = req.params.id;

    let sql = `SELECT *,
	            (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
	            (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) 
                AS liked FROM books
                LEFT JOIN category
                ON books.categoryId = category.categoryId
                WHERE books.id=?;`;
    
    let values = [user_id, book_id, book_id]            
    conn.query(sql,values,(err, results)=>{
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