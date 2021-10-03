var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var gameSchema = new Schema({
    id: String,
    game_id: String,
    game_name: String,
    time_hours: Number,
    time_minutes: Number,
    time_seconds: Number,
    platform: Number,
    date: { type: Date, defualt: Date.now },
    link: String,
    runType: String,
})
var playerModel = mongoose.model('requestSchema', gameSchema);

module.exports = playerModel