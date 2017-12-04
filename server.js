const User = require('./models/users');
const foodLog = require('./models/food-log');
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
        .header("x-app-id", "91d999d6")
        .header("x-app-key", "90c9640d86c64ef7df97b0c16d73a27c")
        .end(function (result) {
            //            console.log(result.status, result.headers, result.body);
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
//GET https://trackapi.nutritionix.com/v2/search/item?nix_item_id=513fc9e73fe3ffd40300109f

//HEADERS required:
//
//x-app-id
//x-app-key
//Response body:
const getFromNutritionixNutrition = function (searchTerm) {
    let emitter = new events.EventEmitter();
    //console.log("inside getFromActive function");
    // https://trackapi.nutritionix.com/v2/search/item?nix_item_id=513fc9e73fe3ffd40300109f
    unirest.get("https://trackapi.nutritionix.com/v2/search/item?nix_item_id=" + searchTerm)
        .header("Accept", "application/json")
        .header("Content-Type", "application/json")
        .header("x-app-id", "91d999d6")
        .header("x-app-key", "90c9640d86c64ef7df97b0c16d73a27c")
        .end(function (result) {
            //            console.log(result.status, result.headers, result.body);
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
    //    console.log('inital cookies = ', req.cookies);
    if ((cookie == undefined) || (cookie.lenght == 0)) {
        // no: set a new cookie

        res.cookie('USER_LOGGEDIN_COOKIE', loggedInUser, {
            maxAge: 900000,
            httpOnly: true
        });
        //        console.log('cookie created successfully');

    } else {
        // yes, cookie was already present
        //        console.log('cookie exists', cookie);
    }
    //    console.log('cookie set = ', req.cookies);
    next(); // <-- important!
});

app.get('/ingredient/:name', function (req, res) { //make the name more relevant (ingrediant)

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
app.get('/nix/:number', function (req, res) { //make the name more robust (nix)

    //    external api function call and response

    var nutritionReq = getFromNutritionixNutrition(req.params.number);

    //get the data from the first api call
    nutritionReq.on('end', function (item) {
        res.json(item);
    });

    //error handling
    nutritionReq.on('error', function (code) {
        res.sendStatus(code);
    });

});


//GET
app.get('/get-requested-food-items/', function (req, res) { //make the name more robust (nix)

    foodLog
        .find()
        .then(function (foodLogResults) {
            //            console.log(foodLogResults);
            res.json({
                foodLogResults
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
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
                    //                    console.log(`User \`${username}\` created.`);
                    return res.json(item);
                }
            });
        });
    });
});

// signing in a user
app.post('/users/login', function (req, res) {

    //    console.log(req.body.username, req.body.password)
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
                        let loggedInUser = req.body.username;
                        //                        console.log(loggedInUser);
                        return res.json(loggedInUser);
                    }
                });
            };
        });
});

//Food Log Endpoints

app.post('/food-log/food-item', (req, res) => {
    let name = req.body.name;
    let calories = req.body.calories;
    let fiber = req.body.fiber;
    let potassium = req.body.potassium;
    let totalFat = req.body.totalFat;
    let carbs = req.body.carbs;
    let protein = req.body.protein;
    let sugar = req.body.sugar;
    let sodium = req.body.sodium;
    let satFat = req.body.satFat;
    let meal = "";
    let username = req.body.username;

    //    console.log(name)
    //    console.log(calories);
    //    console.log(fiber);
    //    console.log(potassium);
    //    console.log(totalFat);
    //    console.log(carbs);
    //    console.log(protein);
    //    console.log(sugar);
    //    console.log(sodium);
    //    console.log(satFat);

    foodLog.create({
        name,
        calories,
        fiber,
        potassium,
        totalFat,
        carbs,
        protein,
        sugar,
        sodium,
        satFat,
        meal,
        username
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if (item) {
            //            console.log(`Food Item \`${name}\` added.`);
            return res.json(item);
        }
    });
});


app.put('/allocate-item-to-meal', function (req, res) {

    let mealTime = req.body.mealTime;
    let itemsId = req.body.itemsId;

    let itemsIdObjt = itemsId.split(",");
    //    console.log(itemsIdObjt);

    itemsIdObjt.forEach(function (value, key) {
        //        console.log(key, value);
        if (value != "") {
            foodLog
                .findByIdAndUpdate(value, {
                    $set: {
                        meal: mealTime
                    }
                }).exec().then(function (foodLog) {
                    return res.status(204).end();
                }).catch(function (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                });
        }
    });

    //    let toUpdate = {};
    //    let updateableFields = ['achieveWhat', 'achieveHow', 'achieveWhen', 'achieveWhy'];
    //    updateableFields.forEach(function (field) {
    //        if (field in req.body) {
    //            toUpdate[field] = req.body[field];
    //        }
    //    });
    //    Achievement
    //        .findByIdAndUpdate(req.params.id, {
    //            $set: toUpdate
    //        }).exec().then(function (achievement) {
    //            return res.status(204).end();
    //        }).catch(function (err) {
    //            return res.status(500).json({
    //                message: 'Internal Server Error'
    //            });
    //        });
});

app.delete('/nix/:number', function (req, res) { //make better name
    foodLog.findByIdAndRemove(req.params.number).exec().then(function (foodLog) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});

app.delete('/delete-nutrition-data/:deleteMeal/:username', function (req, res) { //make better name
    console.log(req.params.username, req.params.deleteMeal);
    foodLog.remove({
        'meal': req.params.deleteMeal
    }, {
        'username': req.params.username
    }).exec().then(function (foodLog) {
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
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;
exports.closeServer = closeServer;
