const express = require("express");
require('express-group-routes');

var Cryptr= require('cryptr');

const db = require('../database/db');
  

const Router = express.Router();
Router.group("/api/v1", (router) => {
    
    router.get("/cred", (req, res) => {
        let secret = req.query.secret ? req.query.secret :  req.body.secret;
        if(!secret) { res.send({ error: 'Secret key is required.'}); return ; }

        let type = req.query.type ? req.query.type :  req.body.type;
        if(!type) { res.send({ error: 'Type is required.'}); return ; }
        let user = req.query.user ? req.query.user :  req.body.user;
        
        try {

            var sql = `select id, type, cast(AES_DECRYPT(user, '${secret}') as char(50)) as user, cast(AES_DECRYPT(password, '${secret}') as char(50)) as password from rkcred WHERE type = '${type}' `;
            if(user) { sql += `and user = AES_ENCRYPT('${user}', '${secret}')`; }
            db.query(sql, function (err, result) {
                if (err) { console.log(err); res.sendStatus(500); return ; }
                let cred = []; var i = 0;
                for(const val of result) {
                    cred.push(val);
                }
                
                res.send({
                    'status': true,
                    'mgs': 'User Credential',
                    'data': cred
                }); return;
            });
        } catch (e) {
            console.log(e);
        }


    });

    router.post("/cred/add", (req, res) => {
        let secret = req.query.secret ? req.query.secret :  req.body.secret;
        if(!secret) { res.send({ error: 'Secret key is required.'}); return ; }

        let type = req.query.type ? req.query.type :  req.body.type;
        let user = req.query.user ? req.query.user :  req.body.user;
        let password = req.query.password ? req.query.password :  req.body.password;

        if(!type) { res.send({ error: 'Type is required.'}); return ;  }
        if(!user) { res.send({ error: 'User is required.'}); return ; }
        if(!password) { res.send({ error: 'Password is required.'}); return ; }
        

        var sql = `select id, type, cast(AES_DECRYPT(user, '${secret}') as char(50)) as user from rkcred WHERE type = '${type}' and user = AES_ENCRYPT('${user}', '${secret}');  `;
        db.query(sql, function (err, result) {
            if (err) { console.log(err); res.sendStatus(500); return ; }
            let isupdated = false;
            for(const val of result) {
                
                    var updatesql = `UPDATE rkcred SET user = AES_ENCRYPT('${user}', '${secret}'), password = AES_ENCRYPT('${password}', '${secret}')  where type = '${type}'and user = AES_ENCRYPT('${user}', '${secret}') ` ;
                    db.query(updatesql, function (err, result) {
                        if (err) throw err;
                 res.send({
                    'status': true,
                    'mgs': 'User Cred Updateddsf'
                }); return;
                        
                        res.send('sdfsdf'); return;
                        console.log("1 record updated.");
                    });
                    isupdated =  true;
            }

            console.log(isupdated, 'isupdated');
            if(!isupdated) {
                var sql = `INSERT INTO rkcred (type, user, password) VALUES ('${type}', AES_ENCRYPT('${user}', '${secret}'), AES_ENCRYPT('${password}', '${secret}'))`;
                db.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.send({
                        'status': true,
                        'mgs': 'User Cred Added'
                    }); return ;
                });
            } 
            
            if(isupdated) {
                res.send({
                    'status': true,
                    'mgs': 'User Cred Updated'
                }); return;
            }
        });

    });
    
    
});
    Router.get("/", (req, res) => {
        res.send('cred-security-with-easy-access');
    });

module.exports = Router;