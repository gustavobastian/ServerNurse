const express = require('express');
const util = require('util')
let pool = require('../../mysql');
let routerAuthenticate = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config({ encoding: 'latin1' })

console.log("*****************************")
console.log(process.env.TAG)
console.log("*****************************")

// DECLARE JWT-secret

let testUser = { username: 'test', password: '1234' };

routerAuthenticate.post('/', async function(req, res) 
{
    console.log("auth")
    if (req.body) 
    {
        let user = req.body;    
        await pool.query('Select username,password,occupation from User WHERE username=?',[user.username], async function(err, result, fields) 
        {
            if (err) 
            {
                console.log("error:"+err)
                let response = JSON.stringify(response_conform);
                console.log(response);            
                res.status(403).send({errorMessage: 'Auth required!'});               
            }
            else
            {
                try
                {
                    testUser.username=result[0].username;
                    testUser.password=result[0].password;
                }catch (e)
                {   
                    console.log("auth error:"+e)
                    res.status(403).send({ errorMessage: 'Auth required!' });
                    return;    
                    }
                
                await bcrypt.compare(user.password, result[0].password, (err, resultComp)=> 
                {
                    if ((resultComp) &&(result[0].occupation=="Administrador") )
                    {
                        let token = jwt.sign(user, process.env.JWT_SECRET,
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
let logout = async(reg,res,next)=>
{
    return next()
}

routerAuthenticate.get('/logout/', logout,async function(req, res) 
{   
    return res.send("logged out").status(200)
}) 

module.exports = routerAuthenticate;