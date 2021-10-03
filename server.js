if (process.env.NODE_ENV != 'production')
    require('dotenv').config()
const mongoose = require('mongoose')
const userSchema = require('./schemas/GameSchema')
const recordSchema = require('./schemas/PlayerDataSchema')
const gameSchema = require('./schemas/GameTypeSchema')
const requestSchema = require('./schemas/RequestSchema')

const RecordController = require("./controllers/RecordController.js")

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error: '))
db.once('open', function () {
    console.log('database connected')
})

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const router = express.Router()


const initPassport = require('./passport-config')
initPassport(
    passport,
    email => userSchema.find(email).email,
    id => userSchema.find(id).id

    // email => users.find(user => user.email === email),
    // id => users.find(user => user.id === id)
)

// const users = [] // lets change this later

app.set('view-engine', "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', checkAuthenticated, async (req, res) => {
    // PlayerData = []
    // for (var i in req.user.PlayerData) {
    //     console.log(await recordSchema.findOne({ "_id": req.user.PlayerData[i] }))
    //     console.log(PlayerData.push(await recordSchema.findOne({ "_id": req.user.PlayerData[i] })))
    // }
    const games = await gameSchema.find()
        .limit(10)
        .sort("name");
    res.render('index.ejs', { user: req.user, PlayerData: games })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    console.log("trying to post")
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const user = await userSchema.create({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
            role: 'user'
        })
        // users.push({
        //     id: Date.now().toString(),
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: await bcrypt.hash(req.body.password, 10),
        //     role: 'admin'
        // })
        res.redirect('/login')
    } catch (e) {
        console.log(e)
        res.redirect('/register')
    }
})

app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

app.get('/newRecord', checkAuthenticated, RecordController.getNewRecord)
app.post('/newRecord', checkAuthenticated, RecordController.getGameToPost)
app.post('/newRecord/:id', checkAuthenticated, RecordController.postNewRecord)
app.delete('/AllowRecord/:id', checkAuthenticated, checkUserType, RecordController.deleteAllowRecord)
app.get('/AllowRecord/:id', checkAuthenticated, checkUserType, RecordController.getAllowRecord)
app.post('/AllowRecord/:id', checkAuthenticated, checkUserType, RecordController.postAllowRecord)


// app.use('/newRecord', checkAuthenticated, RecordController)
// app.get('/newRecord', checkAuthenticated, (req, res) => {
//     console.log(req.user)
//     res.render('newRecord.ejs', { name: req.user.name })
// })

// app.post('/newRecord', checkAuthenticated, async (req, res) => {
//     const gameType = await gameSchema.findOne({ "name": req.body.game_name })
//     console.log(gameType)
//     console.log("gameType")
//     if (gameType == undefined)
//         res.render('newRecord.ejs')
//     else
//         res.render('newRecordData.ejs', { PlayerData: gameType })
// })

app.get('/admin', checkAuthenticated, checkUserType, async(req, res) => {
    const games = await requestSchema.find()
        .limit(10)
        // .sort("name");
    // console.log(games)
    res.render('admin.ejs', { user: req.user, PlayerData: games })
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    return next()
}

function checkUserType(req, res, next)
{
    console.log(req.user.role)
    if(req.user.role != 'admin')
        return res.redirect('/')
    next()
}

app.post('/newGame', async (req, res) => {
    console.log("trying something new")
    const hashedPass = await bcrypt.hash(req.body.pass, 10)
    if (bcrypt.compare(process.env.ADMIN, hashedPass)) {
        const newGame = await gameSchema.create({
            name: req.body.g_name,
            releaseDate: req.body.release_date,
            runType: req.body.run_type,
            gameImage: req.body.game_image
        })
        console.log(newGame)
        res.redirect('/')
    }
    else
        res.redirect('/')
})
app.get('/newGame', async (req, res) => {
    res.render('newGame.ejs')
})
app.get('/:id/', async (req, res) => {
    PlayerData = await recordSchema.find({ "game_id": req.params.id })

    res.render('specificGame.ejs', { user: req.user, PlayerData: PlayerData })
})
app.get('/:id/:runType', async (req, res) => {
    PlayerData = await recordSchema.find({ "game_id": req.params.id, "runType": runType })

    res.render('specificGame.ejs', { user: req.user, PlayerData: PlayerData })
})


app.listen(3000)