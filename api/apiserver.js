const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables from .env file


const HavaleRoutes = require('./routes/HavaleRoute');
const HesapRoutes = require('./routes/HesapRoute');
const KullaniciRoutes = require('./routes/KullaniciRoute');
const SubeRoutes = require('./routes/SubeRoute');
dotenv.config();
const databaseUri = process.env.DB_LINK;
console.log("databaseUri: " + databaseUri);
mongoose.connect(databaseUri)
mongoose.connection.on('error', (err) => { console.log('Something went wrong with database connection:\n' + err); });
mongoose.connection.once('open', () => { console.log('Successfully connected to database'); });

const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => { console.log('Server started and listening to port:' + port); });

app.use(helmet({ xPoweredBy: false }));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/havale', HavaleRoutes);
app.use('/hesap', HesapRoutes);
app.use('/kullanici', KullaniciRoutes);
app.use('/sube', SubeRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status
        }
    });
});