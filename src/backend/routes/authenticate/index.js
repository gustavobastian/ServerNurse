const express = require('express');
var pool = require('../../mysql');
var routerAuthenticate = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config({ encoding: 'latin1' })



console.log("*****************************")
console.log(process.env.TAG)
console.log("*****************************")

// DECLARE JWT-secret



var testUser = { username: 'test', password: '1234' };

routerAuthenticate.post('/', async function(req, res) {
    console.log("auth")
    if (req.body) {
        var user = req.body;
        console.log(user);
        await pool.query('Select * from User WHERE username=?',[user.username], async function(err, result, fields) {
            if (err) {
                console.log("error:"+err)
                var response = JSON.stringify(response_conform);
                console.log(response);            
                res.status(403).send({
                    errorMessage: 'Auth required!'});
                return;    
            }
            else{
                testUser.username=result[0].username;
                testUser.password=result[0].password;
               await bcrypt.compare(user.password, result[0].password, (err, resultComp)=> {

                if (resultComp==true ) {
                    var token = jwt.sign(user, JWT_Secret);
                    res.status(200).send({
                        signed_user: user,
                        token: token
                    });
                } else {
                    res.status(403).send({
                        errorMessage: 'Auth required!'
                    });
                }
                })
                }
            }) 
        } else {
            res.status(403).send({
                errorMessage: 'Please provide username and password'
            });
        }

    })
    


module.exports = routerAuthenticate;