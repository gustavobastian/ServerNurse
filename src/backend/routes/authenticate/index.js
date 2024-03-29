const express = require('express');
const util = require('util')
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

routerAuthenticate.post('/', async function(req, res) 
{
    console.log("auth")
    if (req.body) 
    {
        var user = req.body;    
        await pool.query('Select username,password,occupation from User \
        WHERE username=?',[user.username], async function(err, result, fields) 
        {
            if (err) 
            {
                console.log("error:"+err)
                var response = JSON.stringify(response_conform);
                console.log(response);            
                res.status(403).send({errorMessage: 'Auth required!'});
                return;    
            }
            else
            {
                try
                {
                    testUser.username=result[0].username;
                    testUser.password=result[0].password;
                }catch (e)
                    {res.status(403).send({errorMessage: 'Auth required!'});
                    return;    
                    }
                
                await bcrypt.compare(user.password, result[0].password, (err, resultComp)=> 
                {
                    if ((resultComp==true  ) &&(result[0].occupation=="Administrador") )
                    {
                        var token = jwt.sign(user, process.env.JWT_SECRET,
                            {
                                expiresIn: process.env.JWT_EXP_TIM
                            });                            
                            res.status(200).send({
                                signed_user: result[0],
                                token: token
                            });                            
                    } 
                    else 
                    {
                        res.status(403).send({errorMessage: 'Auth required!'});
                    }
                })
                    
            }      
        }) 
    } 
    else 
    {
        res.status(403).send({errorMessage: 'Please provide username and password'});
    }
})

//remove logged user
logout = async(reg,res,next)=>
{
    return next()
}

routerAuthenticate.get('/logout/', logout,async function(req, res) 
{   
    return res.send("logged out").status(200)
}) 

module.exports = routerAuthenticate;