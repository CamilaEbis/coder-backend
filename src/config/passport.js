import local from 'passport-local'
import passport from 'passport'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import { userModel } from '../models/users.models.js'
import GithubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register',new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body
            try {
                const user = await userModel.findOne({ email: username})
                if(user) {
                    return done(null, false)
                }
                const passwordHash = createHash(password)
                const userCreated = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    password: passwordHash
                })
                console.log(userCreated)
                return done(null, userCreated)

            } catch (error) {
                return done(error)
            }
        }
    ))



    //login
    passport.use('login', new LocalStrategy({usernameField: 'email'}, async(username, password, done)=> {
        try {
            const user = await userModel.findOne({ email: email })
            if(!user) {
                return done(null, false)
            }
            if(validatePassword(password, user.password)) {
                return done(null, user) //user y contras validos
            }
            return done(null, false) //contras no valida
        } catch(error) {
            return done(error)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL

    }, async (accessToken, refreshToken, profile, done) => {

        try {
            console.log(accessToken)
            console.log(refreshToken)
            const user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                console.log("estoy por el user", user);
                done(null, user)
            } else {
                console.log("estoy por el profile._json 2: ", profile._json);;
                const userCreated = await userModel.create({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18, //Edad por defecto,
                    password: 'password'
                })
                done(null, userCreated)

            }
        } catch (error) {
            done(error)
        }
}))

    //inicializar sesion
    passport.serializeUser((user, done) => {
        console.log(user);
        done(null, user._id)
    })
    //eliminar la sesion del user 
    passport.deserializeUser(async(id,done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport