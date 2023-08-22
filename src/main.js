import express from 'express'
import multer from 'multer';
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import routerProd from './routes/products.routes.js'

import { __dirname } from './path.js';
import path from 'path';
import cartsRouter from './routes/cart.routes.js';
import ProductManager from './controllers/productManager.js';

const app = express();
const puerto = 8085;

const productManager = new ProductManager('./src/models/Products.txt');

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



//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

const upload = multer({ storage: storage})

//conexion de Socket.io
io.on("connection", (socket) => {
    console.log("conexion con Socket.io")

    socket.on('mensaje', info => {
        console.log(info)
        socket.emit('respuesta', true)
    })

    socket.on('nuevoProducto', async (prod) => {
        console.log(prod)
        
        await productManager.addProduct(prod);
        const products = await productManager.getProducts();
        socket.emit('products', products);
    })

    socket.on('load', async () => {
        const products = await productManager.getProducts();
        socket.emit('products', products);
    })

    socket.emit("MensajeProductoCreado", "El producto se creo correctamete")
})

//routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/product', routerProd)

app.get('/static', (req, res) => {

    res.render("home", {
        titulo: "products",
        nombreUsuario : "Camila",
        rutaJS: "home"

    })

})

app.get('/realtimeproducts', (req, res) => {

    res.render("realTimeProducts", {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts"
    })

})


app.use('/api/cart', cartsRouter)
app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("img cargada")
})
