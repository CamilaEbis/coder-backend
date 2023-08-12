import express from 'express'

import routerProd from './routes/products.routes.js'

import { __dirname } from './path.js';

const app = express();
const puerto = 8080;

//server
app.listen(puerto, () => {
    console.log("Servidor activo en el puerto: " + puerto);
});

//routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/product', routerProd)

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true}))