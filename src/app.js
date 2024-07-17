//instalar express : npm i express

import express from 'express';
import config from './config.js';
// import {Server} from 'socket.io'
import session from 'express-session';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
// import mongoose from 'mongoose';
//import FileStore from 'session-file-store';
import initSocket from './sockets.js';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import MongoSingleton from './mongo.singleton.js';
import cors from 'cors'


import cookieRouter from './routes/cookies.routes.js';
import router from './routes/users.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js';
import sessionRouter from './routes/sessions.routes.js'

const app = express();
//const FileStorage = FileStore(session);


app.use(cors({
    origin:'*'
}));
app.use(express.json());

const expressInstance = app.listen(config.PORT, async() => {
    MongoSingleton.getInstance();
    const socketServer = initSocket(expressInstance);
    app.set('socketServer', socketServer);

    
    app.use(express.urlencoded({ extended: true}));
    app.use(cookieParser());
    app.use(session({
        // store: new FileStorage({ path: '/.sessions', ttl:100, retries:0 }),
        store: MongoStore.create({
            mongoUrl:config.mongoDB_Atlas,
            ttl: 15
        }),
        secret: config.SECRET,
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    app.use('/', viewsRouter)
    app.use('/api/users',router);
    app.use('/api/product',productRoutes);
    app.use('/api/cart',cartRoutes);
    app.use('/api/cookies', cookieRouter);
    app.use('/static',express.static(`${config.DIRNAME}/public`));
    app.use('/api/sessions', sessionRouter)


    // const httpServer = app.listen(config.PORT, async ()=>{
    //     await mongoose.connect(config.mongoDB_Atlas);
    console.log(`Servidor activo en puerto ${config.PORT}`);
    //     console.log(config.DIRNAME)
    // });

    // const socketServer = new Server(httpServer);

    // El método set() nos permite setear objetos globales para nuestra app.
    // En este caso lo aprovechamos para socketServer, que luego recuperaremos
    // desde los endpoints donde necesitemos publicar mensajes Websockets.


    // socketServer.on('connection', client => {
    //     /**
    //      * Cada vez que un nuevo cliente se conecta, se publica en el tópico
    //      * chatLog la lista actual de mensajes del chat, SOLO para ese cliente.
    //      */
    //     client.emit('chatLog', messages);
    //     console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);

    //     /**
    //      * Cada vez que llega un nuevo mensaje desde algún cliente,
    //      * sea actualiza la lista de chats del servidor (solo un array
    //      * en memoria para este ejemplo), y se emite un contenido en el tópico
    //      * messageArrived, hacia TODOS los clientes conectados.
    //      */
    //     client.on('newMessage', data => {
    //         messages.push(data);
    //         console.log(`Mensaje recibido desde ${client.id}: ${data.user} ${data.message}`);

    //         socketServer.emit('messageArrived', data);
    //     });
    // });
});