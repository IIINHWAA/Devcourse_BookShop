const conn = require('../db');
const {StatusCodes} = require('http-status-codes');

const getCategory = (req,res)=>{
    let sql = 'SELECT * FROM category'
    conn.query(sql,(err, results)=>{
        if(err){
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        else{
            return res.status(StatusCodes.OK).json(results);
        }
    })
};

module.exports = {
    getCategory
}