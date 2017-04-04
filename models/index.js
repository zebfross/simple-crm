require('mongoose').models = {};
module.exports = {
    User: require('./user'),
    Client: require('./client'),
    Activity: require('./activity'),
    Reminder: require('./reminder'),
    Alert: require('./alert'),
    Token: require('./token')
};
