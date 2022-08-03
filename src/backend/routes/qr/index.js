var express = require('express');
var routerQR = express.Router();
var pool = require('../../mysql');




/**
 * return selected all qrs
 * 
 */

 routerQR.get('/', function(req, res) {    
    pool.query('SELECT * FROM `QRbed` ORDER BY QRbed.QRId DESC  ', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
    //res.send(["Funciona"]);
});

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
 * //transaction for looking for last created bedid, and then save the new QR
 *{"QR":"CAMA CALIENTE"}
 */
 routerQR.post('/', function(req, res) {    
  //  console.log("req:"+JSON.stringify(req.body))
   // console.log(req.body);    
  //  console.log(JSON.stringify(req.body));   
   
    let qr=req.body.QR;
    console.log("Qr:"+qr);


	bedId=0;
    pool.query(
    'INSERT INTO QRbed(`bedId`, `QR`) \
    VALUES (?,?)',[bedId,qr], function(err, result, fields) {
    if (err) {
		console.log("error 2");
		 res.send("error2").status(400);
    }
    else{res.send(result.bedId).status(202);}
	});        
       
               
    

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
    let qrId=parseInt(req.params.id);
    let bedId=parseInt(req.body.bedId);
    let qr=req.body.QR;
   console.log("Qr:"+qr);
        
    pool.query(
        'UPDATE QRbed SET \
        `bedId` = ?   \
        `QR` = ?   \
        WHERE `QRbed`.`qrId` = ?;',[bedID,qr,qrId], function(err, result, fields) {
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
