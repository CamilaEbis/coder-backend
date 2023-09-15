import express from 'express'
import multer from 'multer';
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

import { __dirname } from './path.js';
import path from 'path';
import cartRouter from './routes/cart.routes.js';
import productRouter from './routes/products.routes.js';

import userRouter from './routes/user.routes.js';
import mongoose from 'mongoose';

import cartModel from './models/carts.models.js'
//import { userModel } from './models/users.models.js'

const app = express();
const puerto = 8085;

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

//mongoose
mongoose.connect('mongodb+srv://camiebiscoder:coder@clustercoder.q9wfrsz.mongodb.net/?retryWrites=true&w=majority')
    .then(async () => {
        console.log("DB conectada")
        await cartModel.create([])
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
