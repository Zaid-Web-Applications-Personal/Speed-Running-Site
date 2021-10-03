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
    console.log(req.body.run_type)
    const gameId = await gameSchema.findOne({ "name": req.params.id })

    const time_seconds = parseInt(req.body.time_seconds) + (60 * parseInt(req.body.time_minutes)) + (3600 * parseInt(req.body.time_hours))
    console.log(parseInt(req.body.time_seconds) + (60 * parseInt(req.body.time_minutes)) + (3600 * parseInt(req.body.time_hours)))
    console.log("HELLO")
    const new_rec = await requestSchema.create({
        id: req.user.id,
        game_id: gameId._id,
        game_name: gameId.name,
        time_seconds: time_seconds,
        platform: req.body.platform,
        date: Date.now(),
        link: req.body.link,
        run_type: req.body.run_type,
        player_name: req.user.name
    })
    console.log(new_rec)

    res.redirect('/')
}

const postAllowRecord = async(req, res, next) => { 
    if(req.body.Remove != undefined)
    {
        console.log(req.body.id)
        const what = await requestSchema.findOneAndRemove({"_id": req.params.id})
        console.log(what)
        res.redirect('/admin')
    }
    else
    {
        console.log(req.body)
        const game = await requestSchema.findOne({"_id": req.params.id})

        const new_rec = await recordSchema.create({
            id: game.id,
            game_id: game.game_id,
            game_name: game.game_name,
            time_seconds: game.time_seconds,
            platform: game.platform,
            date: game.date,
            link: game.link,
            run_type: game.run_type,
            player_name: game.player_name
        })
        await userSchema.findOneAndUpdate({ "id": game.id }, { $push: { "PlayerData": new_rec } })
        await requestSchema.findOneAndRemove({"_id": req.params.id})
    
        res.redirect('/admin')
    }
}

const getAllowRecord = async(req, res, next) => {
    const game = await requestSchema.findOne({"_id": req.params.id})
    res.render('../views/allow.ejs', { user: req.user, PlayerData: game })
}

module.exports = {getGameToPost, getNewRecord, postNewRecord, getAllowRecord, postAllowRecord}