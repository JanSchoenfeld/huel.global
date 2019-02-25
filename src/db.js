const MongoClient = require('mongodb').MongoClient;

function startDB(app, callback) {
    const url = 'mongodb://localhost:27017';
    const options = {
        useNewUrlParser: true
    };

    MongoClient.connect(url, options, (err, client) => {
        if (err) {
            console.log('Could not connect to MongoDB: ', err.stack);
            process.exit(1);
        } else {
            app.locals.db = client.db('hgDb');
            console.log('MongoDB connection established');
            callback();
        }
    });
}

module.exports = startDB;