const User = require('./models/users');
const online = require('./models/online');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config');
const mongoose = require('mongoose');
const moment = require('moment');
const cors = require('cors');


const unirest = require('unirest');
const events = require('events');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static('public'));;

mongoose.Promise = global.Promise;

let USER_LOGGEDIN_COOKIE = 'user-loggedin';

let loggedInUser = "";

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server = undefined;

function runServer(urlToUse) {
    return new Promise((resolve, reject) => {
        mongoose.connect(urlToUse, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(config.PORT, () => {
                console.log(`Listening on localhost:${config.PORT}`);
                resolve();
            }).on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    runServer(config.DATABASE_URL).catch(err => console.error(err));
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}


// external API call
const getFromNutritionix = function (searchTerm) {
    let emitter = new events.EventEmitter();
    //console.log("inside getFromActive function");
    unirest.get("https://trackapi.nutritionix.com/v2/search/instant?query=" + searchTerm)
        .header("Accept", "application/json")
        .header("Content-Type", "application/json")
        .header("x-app-id", "3695a268")
        .header("x-app-key", "684be36e7fdca1a4cbeac908344a2cb3")
        .end(function (result) {
            console.log(result.status, result.headers, result.body);
            //success scenario
            if (result.ok) {
                emitter.emit('end', result.body);
            }
            //failure scenario
            else {
                emitter.emit('error', result.code);
            }
        });

    return emitter;
};


// ---------------USER ENDPOINTS-------------------------------------

//app.get('/', (req, res) => {
//    const cookie = req.cookies[USER_LOGGEDIN_COOKIE];
//    console.log("=++++++++>>>>>app get cookie = ", cookie);
//    if (cookie === "user-loggedin") {
//        res.sendFile(__dirname + '/public/index.html');
//
//    }
//});



// MISC ------------------------------------------
// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res, next) => {
    // check if client sent cookie
    var cookie = req.cookies.USER_LOGGEDIN_COOKIE;
    console.log('inital cookies = ', req.cookies);
    if ((cookie == undefined) || (cookie.lenght == 0)) {
        // no: set a new cookie

        res.cookie('USER_LOGGEDIN_COOKIE', loggedInUser, {
            maxAge: 900000,
            httpOnly: true
        });
        console.log('cookie created successfully');

    } else {
        // yes, cookie was already present
        console.log('cookie exists', cookie);
    }
    console.log('cookie set = ', req.cookies);
    next(); // <-- important!
});

app.get('/ingredient/:name', function (req, res) {

    //    external api function call and response

    var searchReq = getFromNutritionix(req.params.name);

    //get the data from the first api call
    searchReq.on('end', function (item) {
        res.json(item);
    });

    //error handling
    searchReq.on('error', function (code) {
        res.sendStatus(code);
    });

});




// POST -----------------------------------
// creating a new user
app.post('/users/create', (req, res) => {
    let username = req.body.username;
    username = username.trim();
    let password = req.body.password;
    password = password.trim();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            User.create({
                username,
                password: hash,
            }, (err, item) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                if (item) {
                    console.log(`User \`${username}\` created.`);
                    return res.json(item);
                }
            });
        });
    });
});

// signing in a user
app.post('/users/login', function (req, res) {

    console.log(req.body.username, req.body.password)
    User
        .findOne({
            username: req.body.username
        }, function (err, items) {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            if (!items) {
                // bad username
                return res.status(401).json({
                    message: "Not found!"
                });
            } else {
                items.validatePassword(req.body.password, function (err, isValid) { //where does validate go to in order to do the pw checking logic
                    if (err) {
                        console.log('There was an error validating the password.');
                    }
                    if (!isValid) {
                        return res.status(401).json({
                            message: "Not found"
                        });
                    } else {


                        online.create({
                            username: req.body.username,
                            unixtime: logInTime,
                        }, (err, item) => {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Internal Server Error'
                                });
                            }
                            if (item) {
                                let logInTime = new Date().getTime() / 1000;
                                loggedInUser = req.body.username;
                                res.cookie('USER_LOGGEDIN_COOKIE', loggedInUser, {
                                    maxAge: 900000,
                                    httpOnly: true
                                });
                                console.log("User logged in: " + loggedInUser + ' at ' + logInTime);
                            }
                        });

                        return res.json(loggedInUser);
                    }
                });
            };
        });
});


// -------------ACHIEVEMENT ENDPOINTS------------------------------------------------
// POST -----------------------------------------
// creating a new achievement
app.post('/new/create', (req, res) => {
    let achieveWhat = req.body.achieveWhat;
    achieveWhat = achieveWhat.trim();
    let achieveHow = req.body.achieveHow;
    let achieveWhy = req.body.achieveWhy;
    let achieveWhen = req.body.achieveWhen;
    let user = req.body.user;

    Achievement.create({
        user,
        achieveWhat,
        achieveHow,
        achieveWhen,
        achieveWhy
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if (item) {
            console.log(`Achievement \`${achieveWhat}\` added.`);
            return res.json(item);
        }
    });
});

// PUT --------------------------------------
app.put('/achievement/:id', function (req, res) {
    let toUpdate = {};
    let updateableFields = ['achieveWhat', 'achieveHow', 'achieveWhen', 'achieveWhy'];
    updateableFields.forEach(function (field) {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    Achievement
        .findByIdAndUpdate(req.params.id, {
            $set: toUpdate
        }).exec().then(function (achievement) {
            return res.status(204).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});

// GET ------------------------------------
// accessing all of a user's achievements
app.get('/achievements/:user', function (req, res) {
    Achievement
        .find()
        .sort('achieveWhen')
        .then(function (achievements) {
            let achievementOutput = [];
            achievements.map(function (achievement) {
                if (achievement.user == req.params.user) {
                    achievementOutput.push(achievement);
                }
            });
            res.json({
                achievementOutput
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});

// accessing a single achievement by id
app.get('/achievement/:id', function (req, res) {
    Achievement
        .findById(req.params.id).exec().then(function (achievement) {
            return res.json(achievement);
        })
        .catch(function (achievements) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});

// DELETE ----------------------------------------
// deleting an achievement by id
app.delete('/achievement/:id', function (req, res) {
    Achievement.findByIdAndRemove(req.params.id).exec().then(function (achievement) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});

//// set a cookie
//app.use(function (req, res, next) {
//    // check if client sent cookie
//    var cookie = req.cookies.USER_LOGGEDIN_COOKIE;
//    console.log('inital cookies = ', req.cookies);
//    if (cookie === undefined) {
//        // no: set a new cookie
//
//        res.cookie('USER_LOGGEDIN_COOKIE', loggedInUser, {
//            maxAge: 900000,
//            httpOnly: true
//        });
//        console.log('cookie created successfully');
//        console.log('cookie set = ', req.cookies.USER_LOGGEDIN_COOKIE);
//    } else {
//        // yes, cookie was already present
//        console.log('cookie exists', cookie);
//    }
//    next(); // <-- important!
//});
//
//// MISC ------------------------------------------
//// catch-all endpoint if client makes request to non-existent endpoint
//app.use('*', (req, res) => {
//    res.status(404).json({
//        message: 'Not Found'
//    });
//});

exports.app = app;
exports.runServer = runServer;
exports.closeServer = closeServer;
