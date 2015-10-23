var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('SQLite/MTG.sqlite');



exports.queryDB = function(query,callback) {
    db.all(query, function(err, rows) {
        if(!err) {
            var rowsJSON = JSON.stringify(rows);
            callback(rowsJSON);
        } else {
            callback(null);
        }
    });
};

exports.queryRes = function(query,res){
    db.all(query, function(err, rows) {
        if(!err) {
            var rowsJSON = JSON.stringify(rows);
            res.send(rowsJSON, {
                'Content-Type': 'application/json'
            }, 200);
        } else {
            res.send(JSON.stringify(err), {
                'Content-Type': 'application/json'
            }, 404);
        }
    });
};

exports.getQryResFunc = function(query){
    return function(req,res){
            exports.queryRes(query, res);
        }
};