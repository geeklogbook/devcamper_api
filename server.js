const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({path: './config/config.env'});

connectDB();

//Routes files
const bootcamps = require('./routes/bootcamps')


const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('combined'));
}

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000 ;

app.listen(PORT, 
           console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold));

process.on('unhandledRejection', (err, promise) => {
    console.log(`${err.message}`.red);
    //Close server & exit process
    ServiceWorkerRegistration.close(() => process.exit(1));
})