var express = require('express');
var routerQR = express.Router();
var pool = require('../../mysql');




/**
 * return selected qr info 
 * @params: id bedID
 */

routerQR.get('/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('SELECT * FROM `QRbed` WHERE bedId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
    //res.send(["Funciona"]);
});

//API for adding new QR 
/**
 * body format:
 *{"QR":"CAMA CALIENTE"}
 */
 routerQR.post('/', function(req, res) {    
    console.log("req:"+JSON.stringify(req.body))
    console.log(req.body);    
    console.log(JSON.stringify(req.body));   
   
    let qr=req.body.QR;
    console.log("Qr:"+qr);
   
    //check for last created bed, in order to get their id
    /*
    
    pool.query(
        'INSERT INTO QRbed(`bedId`, `QR`) \
        VALUES (?,?)',[bedId,QR], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });*/
    
    res.status(200);

});

//API for editing QR 
/**
 * body format: 
 * /:id', id=bedId
 * {"QR":"CAMA CALIENTE"}
 */
 routerQR.put('/:id', function(req, res) {
    console.log(req.body);    
    console.log(JSON.stringify(req.body));   
    let bedId=parseInt(req.params.id);
    let qr=req.body.QR;
   console.log("Qr:"+qr);
        
    pool.query(
        'UPDATE QRbed SET \
        `QR` = ?   \
        WHERE `QRbed`.`bedId` = ?;',[qr, bedId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.status(200);
    });


});

//API for deleting QR
/**
 * body format: 
 * any
 * id= bediD
 */
 routerQR.delete('/:id', function(req, res) {
    console.log(req.body);    
    let bedId=parseInt(req.params.id);
        
    pool.query(
        'DELETE FROM QRbed \
        WHERE \
         `QRbed`.`bedId` = ?;',[bedId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.status(202);
    });
    res.status(200);

});

module.exports = routerQR;