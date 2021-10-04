if (process.env.NODE_ENV != 'production')
    require('dotenv').config()
const mongoose = require('mongoose')
const userSchema = require('./schemas/GameSchema')
const recordSchema = require('./schemas/PlayerDataSchema')
const gameSchema = require('./schemas/GameTypeSchema')
const requestSchema = require('./schemas/RequestSchema')

const RecordController = require("./controllers/RecordController.js")
const UserController = require("./controllers/UserController.js")

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

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
)

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
app.use(express.static('public'));


app.get('/', checkAuthenticated, async (req, res) => {
    const games = await gameSchema.find()
        .limit(10)
        .sort("name");
    res.render('index.ejs', { user: req.user, PlayerData: games })
})


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/login', checkNotAuthenticated, UserController.getLogin)
app.get('/register', checkNotAuthenticated, UserController.getRegister)
app.get('/logout', UserController.getLogout)
app.post('/register', checkNotAuthenticated, UserController.postRegister)


app.get('/newRecord', checkAuthenticated, RecordController.getNewRecord)
app.post('/newRecord', checkAuthenticated, RecordController.getGameToPost)
app.get('/newRecord/search', checkAuthenticated, checkUserType, RecordController.postSearchGame)
app.post('/newRecord/:id', checkAuthenticated, RecordController.postNewRecord)
app.get('/AllowRecord/:id', checkAuthenticated, checkUserType, RecordController.getAllowRecord)
app.post('/AllowRecord/:id', checkAuthenticated, checkUserType, RecordController.postAllowRecord)

app.get('/admin', checkAuthenticated, checkUserType, async(req, res) => {
    const games = await requestSchema.find()
        .limit(10)
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
            run_type: req.body.run_type,
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
app.get('/:id/:run_type', async (req, res) => {
    PlayerData = await recordSchema.find({ "game_id": req.params.id, "run_type": run_type })

    res.render('specificGame.ejs', { user: req.user, PlayerData: PlayerData })
})


app.listen(3000)