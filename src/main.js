import express from 'express'

import ProductManager from "./productManager.js";

const app = express();
const puerto = 8080;
const PM = new ProductManager();
let products = PM.getProducts();

app.get("/products/", async (req, res) => {
    let {limit} = req.query;

    res.send({products:limit ? await products.slice(0, limit) : await products});
});

app.get("/products/:pid", async (req, res) => {
    let pid = Number(req.params.pid);
    
    res.send({product: await PM.getProductById(pid)});
});

app.listen(puerto, () => {
    console.log("Servidor activo en el puerto: " + puerto);
});