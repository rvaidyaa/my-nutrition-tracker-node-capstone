exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://admin:admin@ds237815.mlab.com:37815/my-nutrition-tracker-node-capstone';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://admin:admin@ds237815.mlab.com:37815/my-nutrition-tracker-node-capstone';
exports.PORT = process.env.PORT || 8081;
