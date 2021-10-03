const userSchema = require('../schemas/GameSchema')
const bcrypt = require('bcrypt')

const getLogin = async(req, res, next) => {
    res.render('login.ejs')
}

const getLogout = async(req, res, next) => {
    req.logOut()
    res.redirect('/login')
}

const getRegister = async(req, res, next) => {
    res.render('register.ejs')
}

const postRegister = async(req, res, next) => {
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
        res.redirect('/login')
    } catch (e) {
        console.log(e)
        res.redirect('/register')
    }
}

module.exports = {getLogin, getLogout, getRegister, postRegister}