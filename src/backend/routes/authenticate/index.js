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

routerAuthenticate.post('/', async function(req, res) {
    console.log("auth")
    if (req.body) {
        var user = req.body;
    //    console.log(user);
        await pool.query('Select username,password,occupation from User WHERE username=?',[user.username], async function(err, result, fields) {
            if (err) {
                console.log("error:"+err)
                var response = JSON.stringify(response_conform);
                console.log(response);            
                res.status(403).send({
                    errorMessage: 'Auth required!'});
                return;    
            }
            else{
                //console.log(response);            

               // console.log(JSON.stringify(result[0]));
                try{
                testUser.username=result[0].username;
                testUser.password=result[0].password;
                }catch (e){res.status(403).send({
                    errorMessage: 'Auth required!'});
                    return;    
                    }
                
                
                    await bcrypt.compare(user.password, result[0].password, (err, resultComp)=> {

                        if ((resultComp==true  ) &&(result[0].occupation=="Administrador") ){
                            var token = jwt.sign(user, process.env.JWT_SECRET,{
                                expiresIn: process.env.JWT_EXP_TIM
                            });
                            /*const coockiesOptions={
                                expires: new Date(Date.now()+process.env.JWT_COOK_TIM*24*60*60*1000),
                                httpOnly: true
                            }*/
                            res.status(200).send({
                                signed_user: result[0],
                                token: token
                            });
                            //res.cookie('jwt',token,coockiesOptions);
                            //res.status(200).send()
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




//remove logged user
logout = async(reg,res,next)=>{
    //res.clearCookie('jwt')
    return next()
}

routerAuthenticate.get('/logout/', logout,async function(req, res) {   
    return res.send("logged out").status(200)
}) 

module.exports = routerAuthenticate;