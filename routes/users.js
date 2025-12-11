// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

const saltRounds = 10

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered',
    [
        check('email').isEmail(),
        check('username').isLength({ min: 5, max: 20 }),
        check('password').isLength({ min: 8 })
    ],
    function (req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register.ejs');
        }

        // saving data in database
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            if (err) {
                return next(err);
            }

            const first = req.sanitize(req.body.first);
            const last = req.sanitize(req.body.last);
            const email = req.sanitize(req.body.email);
            const username = req.sanitize(req.body.username);

            let sql = "INSERT INTO users(first_name, last_name, email, username, hashedPassword) VALUES (?,?,?,?,?)";
            db.query(sql, [first, last, email, username, hashedPassword], function(err, result) {
                if (err) {
                    return next(err);
                }

                final_result = ' Hello ' + req.body.first + ' ' + req.body.last +
                ' you are now registered!  We will send an email to you at ' + req.body.email 
                res.send(final_result);
            });
        });
    }
);

router.get('/login', function(req,res,next) {
    res.render('login.ejs')
})

// Handle login form submission
// Handle login form submission
router.post('/loggedin',
    [
        check('username').notEmpty(),
        check('password').notEmpty()
    ],
    function (req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('login.ejs');
        }

        const username = req.sanitize(req.body.username);
        const password = req.body.password;

        // fetch id + hashedPassword
        const sql = "SELECT id, hashedPassword FROM users WHERE username = ?";

        db.query(sql, [username], function(err, results) {
            if (err) {
                return next(err);
            }

            // Username not found
            if (results.length == 0) {
                return res.send("Login failure: username not found.");
            }

            const user = results[0]
            const hashedPassword = user.hashedPassword

            // Compare password
            bcrypt.compare(password, hashedPassword, function(err, match) {
                if (err) {
                    return next(err);
                }

                if (match) {
                    // store numeric id in session
                    req.session.userId = user.id;
                    req.session.username = username;

                    res.send('You are now logged in. <a href='+'/'+'>Home</a>')
                } else {
                    res.send("login failed: incorrect password");
                }
            });
        });
    }
);


router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
        return res.redirect('./')
    }
    res.send('You are now logged out. <a href='+'/'+'>Home</a>')
    })
})


// Export the router object so index.js can access it
module.exports = router