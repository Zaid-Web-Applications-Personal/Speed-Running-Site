var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var gameSchema = new Schema({
    id: String,
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    PlayerData: [{ type: Schema.Types.ObjectId, ref: 'playerMode' }],
    role: {type: String, default: 'user'}
})


var gameModel = mongoose.model('GameMode', gameSchema);

module.exports = gameModel