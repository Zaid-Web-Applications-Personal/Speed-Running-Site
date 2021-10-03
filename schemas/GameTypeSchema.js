var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var gameSchema = new Schema({
    name: { type: String, required: true },
    releaseDate: Date,
    run_type: [{ type: String }],
    gameImage: String
})


var gameTypeModel = mongoose.model('gameTypeModel', gameSchema);

module.exports = gameTypeModel