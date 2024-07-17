//Estrategias

import passport from 'passport';
import local from 'passport-local';
import UserCollectionManager from '../dao/userManagerMdb.js';
import { isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2'
import config from '../config.js';

const localStrategy = local.Strategy;
const manager = new UserCollectionManager();

const initAuthStrategies = () => {
    passport.use('login', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, password, done) => {
            try {
                const checkUser = await manager.getUser(email);

                if (checkUser && isValidPassword(password, checkUser.password)) {
                    const { password, ...filteredcheckUser } = checkUser;
                    return done(null, filteredcheckUser);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.use('ghlogin', new GitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                // Si passport llega hasta acá, es porque la autenticación en Github
                // ha sido correcta
                const email = profile._json?.email || null;
                // console.log(profile)
                
                // Necesitamos que en el profile haya un email
                if (email) {
                    // Tratamos de ubicar en NUESTRA base de datos un usuario
                    // con ese email, si no está lo creamos y lo devolvemos,
                    // si ya existe retornamos directamente esos datos
                    const checkUser = await manager.getUser(email);


                    if (!checkUser) {
                        const user = {
                            firstName: profile._json.name.split(' ')[0],
                            lastName: profile._json.name.split(' ')[1],
                            email: email,
                            age: null,
                            password: 'none'                            
                        }

                        await manager.createUser(user.firstName,user.lastName,user.email,user.age,user.password);
                        const recheckUser = await manager.getUser(email);

                        return done(null, recheckUser);
                    } else {
                        return done(null, checkUser);
                    }
                } else {
                    return done(new Error('Faltan datos de perfil'), null);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

export default initAuthStrategies;