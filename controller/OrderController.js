//const conn = require('../db');
const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');
var dotenv = require('dotenv');
dotenv.config();
const DB_PASSWORD = process.env.DB_PASSWORD;

const order = async(req, res) =>{
    const conn = await mysql.createConnection({
        host: 'localhost',
        port: '3307',
        user: 'root',
        password : DB_PASSWORD,
        database: 'BookShop',
        dateStrings : true,
    });

    const {items, delivery, totalQuantity, totalPrice, userId, firstBookTitle} = req.body
    
    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?,?,?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql,values);
    let delivery_id = results.insertId;

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
    [results] = await conn.execute(sql,values);
    let order_id = results.insertId;

    //items를 가지고 장바구니에서 인자 꺼냄
    sql =`SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
    let [orderItems, fields] = await conn.query(sql,[items]);

    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    values = [];
    orderItems.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
    });
    console.log(values);
    results  = await conn.query(sql,[values]);

    let result = deleteCartItems(conn, items);
    return res.status(StatusCodes.OK).json(result);
};

const deleteCartItems = async (conn,items) =>{
    console.log(items);
    let sql = `DELETE FROM cartItems WHERE id IN (?); `
    let result = await conn.query(sql,[items]);
    return result;
};


const getOrders = async (req, res) =>{
    const conn = await mysql.createConnection({
        host: 'localhost',
        port: '3307',
        user: 'root',
        password : DB_PASSWORD,
        database: 'BookShop',
        dateStrings : true,
    });

    let sql = `SELECT orders.id, created_at, address, receiver, contact,
                book_title, total_quantity, total_price
                FROM orders LEFT JOIN delivery
                ON orders.delivery_id = delivery.id;`
    let [rows, fields] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(rows);

};

const getOrderDetail = async(req, res) =>{
    const conn = await mysql.createConnection({
        host: 'localhost',
        port: '3307',
        user: 'root',
        password : DB_PASSWORD,
        database: 'BookShop',
        dateStrings : true,
    });

    let sql =`SELECT book_id, title, author, price, quantity
                FROM orderedBook LEFT JOIN books
                ON orderedBook.book_id = books.id;`;
    let [rows, fields] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(rows);           

};


module.exports = {
    order, 
    getOrders,
    getOrderDetail
}