const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars')

const port = 3000;

const app = express();

console.log(__dirname + "/public/js/main.js");

function configureApp(app) {

    const engineConfig = {
        extname: '.hbs',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        partialsDir: path.join(__dirname, 'views', 'partials'),
        defaultLayout: 'main'
    }

    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static(path.join(__dirname, '../bower_components')));
    app.engine('hbs', exphbs(engineConfig));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');


    app.get('/', (req, res) => {
        res.render('./layouts/main.hbs');
    })

    app.get('/bye', (req, res) => {
        res.send('ok bye 4 eva');
    })

}

function start() {

    configureApp(app);

    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    })
}

start();