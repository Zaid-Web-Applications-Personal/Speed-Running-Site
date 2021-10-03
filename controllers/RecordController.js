const userSchema = require('../schemas/GameSchema')
const recordSchema = require('../schemas/PlayerDataSchema')
const gameSchema = require('../schemas/GameTypeSchema')
const requestSchema = require('../schemas/RequestSchema')



const getNewRecord = (req, res, next) => {
    res.render('../views/newRecord.ejs', { name: req.user.name })
}

const getGameToPost = async(req, res, next) => {
    const gameType = await gameSchema.findOne({ "name": req.body.game_name })
    console.log(gameType)
    console.log("gameType")
    if (gameType == undefined)
        res.render('newRecord.ejs')
    else
        res.render('newRecordData.ejs', { PlayerData: gameType })
}

const postNewRecord = async(req, res, next) => {

    console.log(req.body)
    console.log(req.body.runType)
    const gameId = await gameSchema.findOne({ "name": req.params.id })
    const time_seconds = req.body.time_seconds + (60 * req.body.time_minutes) + (3600 * req.body.time_hours)
    console.log(time_seconds)
    const new_rec = await requestSchema.create({
        id: req.user.id,
        game_id: gameId._id,
        game_name: gameId.name,
        time_seconds: time_seconds,
        platform: req.body.platform,
        date: Date.now(),
        link: req.body.link,
        runType: req.body.runType
    })

    res.redirect('/')
}

const postAllowRecord = async(req, res, next) => { 
    console.log(req.body.Add)
    console.log(req.body.Remove)
    if(req.body.Remove != undefined)
    {
        const what = await requestSchema.findOneAndRemove({"_id": req.body.id})
        console.log(what)
        res.redirect('/admin')
    }
    else
    {
        console.log(req.body)
        const game = await requestSchema.findOne({"_id": req.body.id})

        const new_rec = await recordSchema.create({
            id: game.id,
            game_id: game.game_id,
            game_name: game.game_name,
            time_seconds: game.time_seconds,
            platform: game.platform,
            date: game.date,
            link: game.link,
            runType: game.runType
        })
        await userSchema.findOneAndUpdate({ "id": game.id }, { $push: { "PlayerData": new_rec } })
        await requestSchema.findOneAndRemove({"_id": req.body.id})
    
        res.redirect('/admin')
    }
}

const postNewAllowRecord = async(req, res, next) => {
    console.log(req.body.Add)
    console.log(req.body.Remove)
    if(req.body.Remove != undefined)
    {
        const what = await requestSchema.findOneAndRemove({"_id": req.body.id})
        console.log(what)
        res.redirect('/admin')
    }
    else
    {
        console.log(req.body)
        const game = await requestSchema.findOne({"_id": req.body.id})
        const time_seconds = game.time_seconds + (60 * game.time_minutes) + (3600 * game.time_hours)
        const new_rec = await recordSchema.create({
            id: game.id,
            game_id: game.game_id,
            game_name: game.game_name,
            time_seconds: time_seconds,
            platform: game.platform,
            date: game.date,
            link: game.link,
            runType: game.runType
        })
        await userSchema.findOneAndUpdate({ "id": game.id }, { $push: { "PlayerData": new_rec } })
        await requestSchema.findOneAndRemove({"_id": req.body.id})
    
        res.redirect('/admin')
    }
}

const getAllowRecord = async(req, res, next) => {
    const game = await requestSchema.findOne(req.params._id)
    res.render('../views/allow.ejs', { user: req.user, PlayerData: game })
}

const deleteAllowRecord = async(req, res, next) => {
    console.log("hello")
    const result = await requestSchema.findOneAndDelete({"_id": req.params.id})
    console.log(result + "Hello")
}

module.exports = {getGameToPost, getNewRecord, postNewRecord, getAllowRecord, postNewAllowRecord, deleteAllowRecord, postAllowRecord}