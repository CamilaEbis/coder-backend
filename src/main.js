import 'dotenv/config'
import express from 'express'
import multer from 'multer';
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

import { __dirname } from './path.js';
import path from 'path';
import cartRouter from './routes/cart.routes.js';
import productRouter from './routes/products.routes.js';
import userRouter from './routes/user.routes.js';
import sessionRouter from './routes/sessions.routes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cartModel from './models/carts.models.js';
//import { userModel } from './models/users.models.js'
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

const app = express();
const puerto = 8085;

//middlewares
app.use(express.json())
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 90
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true}))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

function auth(req,res,next) {
    console.log(req.session.email)

    if(req.session.email == "admin@admin.com" && req.session.password == "1234") {
        return next()
    }
    return res.send("no tenes acceso a este contenido")
}

//mongoose
mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("DB conectada")
        await cartModel.create({
            mongoUrl: process.env.MONGO_URL,
            mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true }
        }),([])
    })
    .catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error))

//server
const server = app.listen(puerto, () => {
    console.log("Servidor activo en el puerto: " + puerto);
});
const io = new Server(server)

//config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage})
const mensajes = []

//conexion de Socket.io
io.on("connection", (socket) => {
    console.log("conexion con Socket.io")
    socket.on('mensaje', info => {
        console.log(info)
        mensajes.push(info)
        io.emit('mensajes', mensajes)
    })
})

//routes
app.use('/static', express.static(__dirname + '/public'))

app.use('/api/users', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/product', productRouter)
app.use('/api/sessions', sessionRouter)

app.get('/static', (req, res) => {

    /*res.render("home", {
        titulo: "products",
        nombreUsuario : "Camila",
        rutaJS: "home"

    })*/

    res.render("chat", {
        rutaJS: "chat",
        rutaCSS: "style"
    })
})

app.get('/realtimeproducts', (req, res) => {

    res.render("realTimeProducts", {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts"
    })

})

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("img cargada")
})

//Cookies

app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es el valor de una cookie', { maxAge: 60000, signed: true }).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies) //Consultar solo las cookies firmadas
    //res.send(req.cookies) Consultar TODAS las cookies
})

//sessions

app.get('/session', (req, res) => {
    if(req.session.counter) {
        req.session.counter++
            req.send(`Entraste ${req.session.counter} veces a la pagina`)
    } else {
        req.session.counter = 1
        req.send("Hola, por prim vez")
    }
})

app.get('/login', (req, res) => {
    // modelo html con 2 campos de texto
    // email
    // password
    // un boton que diga confirmar
    // ese boton llama a la api: api/sessions/login
    res.render("login", {
        rutaJS: "login",
        rutaCSS: "style"
    })
})

app.get('/admin', auth, (req, res) => {
    res.send("Sos admin")
})

app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error)
            console.log(error)
        else
            res.redirect('/')
    })
})
