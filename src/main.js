import express from 'express'
import multer from 'multer';
import routerProd from './routes/products.routes.js'

import { __dirname } from './path.js';
import cartsRouter from './routes/cart.routes.js';

const app = express();
const puerto = 8080;

//config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})


//server
app.listen(puerto, () => {
    console.log("Servidor activo en el puerto: " + puerto);
});

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
const upload = multer({ storage: storage})

//routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/product', routerProd)
app.use('/api/cart', cartsRouter)
app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("img cargada")
})
