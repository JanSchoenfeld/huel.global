const express = require('express');
const startDB = require('./db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const exphbs = require('express-handlebars');
const users = require('./routes/users');
const signIn = require('./routes/sign-in');
const signUp = require('./routes/sign-up');

const port = 3000;

function configureApp(app) {

    const engineConfig = {
        extname: '.hbs',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        partialsDir: path.join(__dirname, 'views', 'partials'),
        defaultLayout: 'main'
    };

    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static(path.join(__dirname, '../bower_components')));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.engine('hbs', exphbs(engineConfig));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');


    app.use('/sign-in', signIn);
    app.use('/sign-up', signUp);
    //middleware für authenthifizierung
    app.use((req, res, next) => {
        const token = req.cookies.jwt || '';
        if (token != '') {
            let userSession = jwt.verify(token, 'secret');
            if (userSession.exp < Date.now()) {
                res.clearCookie('jwt');
                res.redirect('/sign-in');
            } else {
                res.locals.user = userSession;
                next();
            }
        } else {
            res.redirect('/sign-in');
        }
    });


    app.use('/users', users);

    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/sign-out', (req,res)=>{
        res.clearCookie('jwt');
        res.redirect('/');
    });

    app.get('/bye', (req, res) => {
        res.send('ok bye 4 eva');
    });

}

function start() {

    const app = express();
    configureApp(app);
    startDB(app, () => startHttpServer(app));

}

function startHttpServer(app) {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}


// function collectionToDb(data, db, collectionName) {
//     let collection = db.collection(collectionName);
//     if (Array.isArray(data)) {
//         collection.insertMany(data, (err, result) => {
//             if (!err) {
//                 console.log('Inserted ' + result.insertedCount + ' into ' + collectionName);
//             }
//         });
//     } else {
//         collection.insertOne(data, (err, result) => {
//             if (!err) {
//                 console.log('Inserted ' + result.insertedCount + ' into ' + collectionName);
//             }
//         });
//     }
// }

start();