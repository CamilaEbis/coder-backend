import { Router } from 'express';
import ProductManager from '../controllers/productManager.js';

const productManager = new ProductManager('src/models/Products.txt');
const routerProd = Router()

routerProd.get('/', async(req,res) => {
    const {limit} = req.query
    const prods = await productManager.getProducts(limit)
    res.status(200).send(products)
})

routerProd.get('/:id', async (req,res) => {
    const {id} = req.params
    const prod = await productManager.getProductById(parseInt(id))

    if (prod)
        res.status(200).send(prod)
    else
        res.status(404).send("producto no existente")
})

routerProd.post('/', async (req,res) => {
    const confirmacion = await productManager.addProduct(req.body)

    if(confirmacion)
        res.status(200).send("producto creado correctamente")
    else
        res.status(400).send("producto ya existente")
})

routerProd.put('/:id', async (req,res) => {
   
    const confirmacion = await productManager.updateProduct(req.params.id, req.body)

    if(confirmacion)
        res.status(200).send("producto actualizado correctamente")
    else
        res.status(400).send("producto ya existente")
})

routerProd.delete('/:id', async(req,res) => {
    const confirmacion = await productManager.deleteProduct(req.params.id)

    if(confirmacion)
        res.status(200).send("producto eliminaod correctamente")
    else
        res.status(400).send("producto no encontrado")
})
export default routerProd