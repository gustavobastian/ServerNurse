var express = require('express');
var routerMessages = express.Router();
var pool = require('../../mysql');

//returns the last 100 messages stored in the database
routerMessages.get('/', function(req, res) 
{
    pool.query('Select * from Messages limit 100', function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else{
            res.send(result);
            return;
        }
    });
});
//Devuelve un array de los 100 ultimos mensajes mensajes con informacion del sender y 
routerMessages.get('/info', function(req, res) 
{
    pool.query('Select messageId,firstname,lastname,patientId,content \
    from Messages JOIN User on Messages.userIdSender=User.userID limit 100', function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else
        {
            res.send(result);
            return;
        }
    });
});
//Inserts a new message into the database
/**
 * body format:
 * [{"messageId":2,
 * "userIdLastName":1,
 * "userIdSender":1,
 * "patientId":"1",
 * "content":"Necesito informacion",
 * "dateTime":"2022-05-01T17:46:26.000Z",
 * "audiolink":null,
 * "userTableId":1}]
 */
routerMessages.post('/', function(req, res) 
{
    console.log(req.body);
    console.log(req.body[0].messageId);
    let messageId=req.body[0].messageId;
    let userIdLastName=req.body[0].userIdLastName;
    let userIdSender=req.body[0].userIdSender;
    let patientId = req.body[0].patientId;
    let content = req.body[0].content;
    let dateTime = req.body[0].dateTime;
    let audiolink = req.body[0].audiolink;
    let userTableId = req.body[0].userTableId;
    console.log(userIdLastName);
    pool.query(
    'INSERT INTO Messages(`messageId`, `userIdLastName`, `userIdSender`, `patientId`, `content`, `dateTime`, `audiolink`, `userTableId`) \
    VALUES (?,?,?,?,?,NOW(),?,?)',[messageId,userIdLastName,userIdSender,patientId,content,audiolink,userTableId], function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else
        {
            res.send(result).status(202);
            return;
        }
    });
});

module.exports = routerMessages;