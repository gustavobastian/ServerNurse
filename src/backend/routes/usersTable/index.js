var express = require('express');
var routerUsersTable = express.Router();
var pool = require('../../mysql');

//Returns all users tables from the hospital
routerUsersTable.get('/', function(req, res) {
    pool.query('Select * from UsersTable', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});


module.exports = routerUsersTable;