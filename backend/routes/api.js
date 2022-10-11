const express = require("express");
require('express-group-routes');

var Cryptr= require('cryptr');

const db = require('../database/db');
  

const Router = express.Router();
Router.group("/api/v1", (router) => {
    
    router.get("/cred", (req, res) => {
        let secret = req.query?.secret ? req.query.secret :  req.body.secret;
        if(!secret) res.send({ error: 'Secret key is required.'});

        let type = req.query?.type ? req.query.type :  req.body.type;
        if(!type) res.send({ error: 'Type is required.'});
        let user = req.query?.user ? req.query.user :  req.body.user;
        
        try {
            cryptr = new Cryptr(secret);

            var sql = `SELECT type, user, password FROM rkcred WHERE type = '${type}'`;
            db.query(sql, function (err, result) {
                if (err) { console.log(err); res.sendStatus(500); return ; }
                var cred = []; var i = 0;
                for(const val of result) {

                    if(user == cryptr.decrypt(val.user)) {
                        var obj = {};
                        obj['type'] =  val.type;
                        obj['password'] =  cryptr.decrypt(val.password);
                        obj['user'] =  cryptr.decrypt(val.user);
                        
                        cred.push(obj);
                    }
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
        let secret = req.query?.secret ? req.query.secret :  req.body.secret;
        if(!secret) res.send({ error: 'Secret key is required.'});

        let type = req.query?.type ? req.query.type :  req.body.type;
        let user = req.query?.user ? req.query.user :  req.body.user;
        let password = req.query?.password ? req.query.password :  req.body.password;

        if(!type) res.send({ error: 'Type is required.'});
        if(!user) res.send({ error: 'User is required.'});
        if(!password) res.send({ error: 'Password is required.'});
        
        cryptr = new Cryptr(secret);
        var hashpassword = cryptr.encrypt(password);
        var hashuser = cryptr.encrypt(user);
        
        var sql = `SELECT user FROM rkcred WHERE type = '${type}'`;
        db.query(sql, function (err, result) {
            if (err) { console.log(err); res.sendStatus(500); return ; }
            let isupdated = false;
            for(const val of result) {
                if(user == cryptr.decrypt(val.user)) {

                    console.log(user, 'rk');
                    var updatesql = `UPDATE rkcred SET password = '${hashpassword}' where type = '${type}'and user = '${val.user}' ` ;
                    db.query(updatesql, function (err, result) {
                        if (err) throw err;
                        console.log("1 record updated.");
                    });
                    isupdated =  true;

                }
            }

            console.log(isupdated, 'isupdated');
            if(!isupdated) {
                var sql = `INSERT INTO rkcred (type, user, password) VALUES ('${type}', '${hashuser}', '${hashpassword}')`;
                db.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.send({
                        'status': true,
                        'mgs': 'User Cred Added'
                    }); return ;
                });
            } else {
                res.send({
                    'status': true,
                    'mgs': 'User Cred Updated'
                }); return;
            }
        });

    });
});

module.exports = Router;