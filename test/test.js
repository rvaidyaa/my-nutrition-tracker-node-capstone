// connect to db
// insert seed data into db
// make HTTP requests to API using the test client
// inspect the state of the db after request is made
// tear down the db

// using ES6 promises

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// requiring in the js files from this app
const foodLog = require('../models/food-log');
//console.log(Achievement);
const User = require('../models/users');
//console.log(User);
const {
    app,
    runServer,
    closeServer
} = require('../server');
// import TEST_DATABASE_URL from ('../config');
const {
    DATABASE_URL,
    TEST_DATABASE_URL
} = require('../config');
console.log(TEST_DATABASE_URL);

// chai
const should = chai.should();
chai.use(chaiHttp);

function seedFoodLogData() {
    console.info('Seeding food log data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateFoodLogData());
    }
    // console.log(seedData);
    // console.log(Achievement);
    // should return a promise
    return foodLog.insertMany(seedData);
}

function generateFoodLogData() {
    return {
        // should be the same as username from generateUserData() above
        name: faker.lorem.sentence(),
        calories: gfh,
        fiber: faker.date.past().toString(), // need faker to make numbers
        potassium: faker.random.numberValue,
        totalFat: faker.lorem.sentence(),
        carbs: faker.lorem.sentence(),
        protein: faker.lorem.sentence(),
        sugar: faker.lorem.sentence(),
        sodium: faker.lorem.sentence(),
        satFat: faker.lorem.sentence(),
        meal: faker.lorem.sentence(),
        username: testUsername,
    }
}

function generateUserData() {
    return {
        username: testUsername,
        password: faker.random.word()
    }
}

function tearDownDb() {
    console.warn('Deleting database!');
    return mongoose.connection.dropDatabase();
}

describe('Foodlogs API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL)
            .then(console.log('running server'))
            .catch(err => console.log({
                err
            }));
    });

    //    beforeEach(function () {
    //        return seedAchievementData();
    //    });
    describe('CRUD OPERATIONS', function () {
        //        it('should return all food items in the DB', function () {
        //            let res;
        //            return chai.request(app)
        //                .get('/get-requested-food-items/')
        //                .end(function (err, res) {
        //                    res.should.have.status(200);
        //                    res.should.be.json;
        //                    done();
        //                });
        //
        //            //                        .then(function (count) {
        //            //                            res.body.foodLogResults.should.have.length.of(count);
        //            //                        });
        //        });
        it('should return all food items in the DB', function (done) {
            chai.request(app)
                .get('/get-requested-food-items/')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    done();
                });
        });
        it('should post food items to the DB', function (done) {
            chai.request(app)
                .post('/food-log/food-item')
                .send({
                    name: 'big mac',
                    calories: '540',
                    fiber: '3',
                    potassium: '444',
                    totalFat: '33',
                    carbs: '43',
                    protein: '21',
                    sugar: '9',
                    sodium: '1231',
                    satFat: '12',
                    meal: 'lunch',
                    username: 'rvaidyaa'
                })
                .end(function (err, res) {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('should delete all meals for a user on DELETE', function (done) {
            chai.request(app)
                .delete('/delete-nutrition-data/rvaidyaa')
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        });
        it('should delete the food item for a particular id on DELETE', function (done) {
            chai.request(app)
                .delete('/nix/5a2734aae5bf2d3934a3f978')
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        });
        after(function (done) {
            foodLog.remove(function () {
                done();
            });
        });
    });

});

//            it('should return food items with the right fields', function () {
//                // ensure they have the expected keys
//                return chai.request(app)
//                    .get('/get-requested-food-items/')
//                    .then(function (res) {
//                        res.should.have.status(200);
//                        res.should.be.json;
//                        res.body.foodLogResults.should.be.a('array');
//                        res.body.foodLogResults.should.have.length.of.at.least(1);
//
//                        res.body.foodLogResults.forEach(function (foodLog) {
//                            foodLog.should.be.a('object');
//                            foodLog.should.include.keys('name', 'calories', 'fiber', 'potassium', 'totalFat', 'carbs', 'protein', 'sugar', 'sodium', 'satFat', 'meal', 'username');
//                        });
//                    });
//            });
