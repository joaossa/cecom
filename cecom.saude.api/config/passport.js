const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    // console.log(authSecret)
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }
    // console.log(JSON.stringify(ExtractJwt.fromAuthHeaderAsBearerToken()))
    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ codigo: payload.codigo })
            .first()
            .then(user => done(null, user ? { ...payload } : false))
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}