const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const bcrypt = require('bcrypt');
const users = require('./routes/users');
const signIn = require('./routes/sign-in');
const signUp = require('./routes/sign-up');

console.log(__dirname)

const port = 3000;

const app = express();

function configureApp(app) {

    const engineConfig = {
        extname: '.hbs',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        partialsDir: path.join(__dirname, 'views', 'partials'),
        defaultLayout: 'main'
    }

    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static(path.join(__dirname, '../bower_components')));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.engine('hbs', exphbs(engineConfig));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');


    app.get('/', (req, res) => {
        res.redirect('/sign-in');
    })

    app.get('/bye', (req, res) => {
        res.send('ok bye 4 eva');
    })

    app.use('/sign-in', signIn);
    app.use('/sign-up', signUp);
    app.use('/users', users);

}

function start() {

    configureApp(app);

    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    })
}

start();