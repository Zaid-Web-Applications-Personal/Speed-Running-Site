const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const userSchema = require('./schemas/GameSchema')
function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {

        user = await userSchema.findOne({ "email": email })
        console.log(password)
        console.log(user.email)
        if (user == undefined) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        const user = await userSchema.findOne({ "id": id })
        return done(null, user)
    })
}

module.exports = initialize