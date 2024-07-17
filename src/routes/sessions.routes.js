import { Router } from 'express';

import config from '../config.js';
import UserCollectionManager from '../dao/userManagerMdb.js';
import { isValidPassword, createHash } from '../utils.js';
import passport from 'passport';
import initAuthStrategies from '../auth/passport.config.js';

const router = Router();

const userManager = new UserCollectionManager()

initAuthStrategies();

/**
 * Al activar el módulo express-session (ver app.js), aparece un objeto
 * req.session que PERSISTE entre llamadas a distintos endpoints.
 * 
 * De esta manera podemos utilizarlo para guardar y verificar info de usuario
 */

/**
 * Un pequeño middleware para controlar el rol de usuario, aprovechando los
 * datos almacenados en la sesión (req.session.user)
 * 
 * Si el rol guardado en el req.session.user no es admin, devolvemos error,
 * sino continuamos la cadena de express (next)
 */
const adminAuth = (req, res, next) => {
    // ?: operador opcional: si no existe el objeto req.session.user o el role no es admin
    // if (!req.session.user || req.session.user.role !== 'admin')
    if (req.session.user?.role !== 'admin')
        return res.status(403).send({ origin: config.SERVER, payload: 'Acceso no autorizado: se requiere autenticación y nivel de admin' });

    next();
}

/**
 * Implementar este endpoint
 * RECORDAR verificar que NO EXISTA el email antes de cargar el nuevo usuario
 */
router.post('/register', async (req, res) => {
    try {
        // console.log(req.file);
        console.log(req.body);
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const age = parseInt(req.body.age);
        const email = req.body.email;
        const password = createHash(req.body.password);
        console.log(age);
        // const role = req.body.role;

        const checkUser = await userManager.getUser(email);
        console.log(password)

        if (checkUser === null) {
            await userManager.createUser(firstName, lastName, email, age, password);
            res.status(200).send({ origin: config.SERVER, payload: 'Usuario creado!' });
        } else {
            return res.status(500).send({ origin: config.SERVER, payload: 'El mail ya se encuentra registrado'})
        }
        
    } catch(err){
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
    // res.status(200).send({ status:3, payload: req.body });
    // res.redirect('/realTimeProducts');

});

// router.get('/hash/:password', async (req,res) =>{
//     res.status(200).send({ origin: config.SERVER, payload: createHash(req.params.password) });
// });

router.post('/login', async (req, res) => {
    try {
        // Recuperamos los campos que llegan del formulario
        const { email, password } = req.body;
        
        // Esto simula datos existentes en base de datos
        // Reemplazar por llamada a método del manager que busque un usuario
        // filtrando por email y clave.

        // const savedFirstName = 'José';
        // const savedLastName = 'Perez';
        // const savedEmail = 'idux.net@gmail.com';
        // const savedPassword = 'abc123';
        // const savedRole = 'admin';

        const checkUser = await userManager.getUser(email);

        const getEmail = checkUser["email"]
        const getPass = checkUser["password"]
        const firstName = checkUser["firstName"]
        const lastName = checkUser["lastName"]
        const role = checkUser["role"]

        // console.log(password)
        // console.log(getPass)
        

        if (getEmail===email && isValidPassword(password,getPass)) {
            req.session.user = { firstName: firstName, lastName: lastName, email: email, role: role };
            res.redirect('/realTimeProducts');
        }else{
            res.status(401).send({ origin: config.SERVER, payload: 'Datos de acceso no válidos' });
        }
        
        
        // res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido!' });
        // res.redirect nos permite redireccionar a una plantilla en lugar de devolver un mensaje
        
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.post('/pplogin', passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}`}), async (req, res) => {
    try {
        req.session.user = req.user;
        res.redirect('/realTimeProducts');
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/ghlogin', passport.authenticate('ghlogin',  {scope: ['user:email']}), async (req, res) => {
});

router.get('/githublogin', passport.authenticate('ghlogin', {failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}`}), async (req, res) => {
    try {
        req.session.user = req.user // req.user es inyectado AUTOMATICAMENTE por Passport al parsear el done()
        res.redirect('/realTimeProducts');
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/current', async(req, res) => {
    try {
        const user = { ...req.session.user };
        user.password = '*******';

        res.status(200).send({
            user: user,
            login_type: user.login_type 
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

/**
 * Utilizamos el middleware adminAuth (ver arriba) para verificar si el usuario
 * está autenticado (tiene una sesión activa) y es admin
 */
router.get('/private', adminAuth, async (req, res) => {
    try {
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });
            // res.status(200).send({ origin: config.SERVER, payload: 'Usuario desconectado' });
            res.redirect('/login');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

export default router;