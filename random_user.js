const express = require('express');
const app = express();

const {faker} = require('@faker-js/faker');

app.get('/faker/users/', function (req,res){
    const {num} = req.query;

    let i = 1;
    let users = [];

    while(i<=num){
        users.push({
            email : faker.internet.email(),
            password : faker.internet.password(),
            fullName : faker.person.fullName(),
            contact : faker.phone.number()
        });
        i++
    }
    res.status(200).json(users);
})

app.listen(4444);