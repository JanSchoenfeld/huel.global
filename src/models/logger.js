const fs = require('fs');

class Logger {

    constructor(){
        
    }

    writeLog(req) {
        if (req.app.locals.user != undefined) {
            fs.appendFile('connection_logs.txt', req.ip + " connected to " + req.originalUrl + " on " + new Date().toLocaleString() + " as " + req.app.locals.user.name + "\n", (err) => {
                if (err) {
                    console.error(err);
                }
            });
        } else {
            fs.appendFile('connection_logs.txt', req.ip + " connected to " + req.originalUrl + " on " + new Date().toLocaleString() + "\n", (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    }
}

module.exports = Logger;