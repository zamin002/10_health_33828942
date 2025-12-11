// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
require('dotenv').config()
const path = require('path')
var mysql = require('mysql2')
var session = require('express-session')
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express()
const port = 8000

app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

// Create an input sanitizer
app.use(expressSanitizer());

// Define our application-specific data
app.locals.appData = {appName: "FitLog"}

// Define the database connection pool
const db = mysql.createPool({
  host: process.env.HEALTH_HOST,
  user: process.env.HEALTH_USER,
  password: process.env.HEALTH_PASSWORD,
  database: process.env.HEALTH_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

global.db = db;

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

const gymsRoutes = require('./routes/gyms')
app.use('/', gymsRoutes)

const workoutRoutes = require('./routes/workouts')
app.use('/', workoutRoutes)

const measurementRoutes = require('./routes/measurements')
app.use('/', measurementRoutes)

const exerciseRoutes = require('./routes/exercise_group')
app.use('/', exerciseRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))