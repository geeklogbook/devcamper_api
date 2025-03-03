const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');


//Load env vars
dotenv.config({path: './config/config.env'});

connectDB();

//Routes files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

app.use(cookieParser())

//Body Parser 
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//Set security headesr
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000,
  max: 100
});

app.use(limiter);

app.use(hpp());

// Enable CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler)

const PORT = process.env.PORT || 5000 ;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold));