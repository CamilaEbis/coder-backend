import { Router } from 'express';
import productModel from '../models/products.models.js';

const productRouter = Router();

productRouter.get('/', async (req, res) => {
    let { limit, page, category, status } = req.query

    try {
        const options = {
            limit: limit || 10,
            page: page || 1
        };
        const query = {};
        category && (query.category = category);
        status && (query.status = status);
        
        const prods = await productModel.paginate(query, options)
        res.status(200).send({ result: 'OK', message: prods })
    } catch (error) {
        res.status(400).send({ error: `Error al consultar productos: ${error}` })
    }
})

productRouter.get("/:pid", async (req, res) => {
    const {pid} = req.params;
    try {
        const prod = await productModel.findById(pid);
        if (prod)
            res.status(200).send({resultado: 'ok', message: prod });
        else
            res.status(404).send({resultado: 'Not Found', message: prod });
            
    }catch (error){
         res.status(400).send({error: `Error al consultar producto: ${error}`});
    };
}); 

productRouter.post('/', async (req, res) => {
    const { title, description, stock, code, price, category } = req.body;
    
    try {
        const respuesta = await productModel.create({
            title, description, stock, code, price, category
        });
            res.status(200).send({resultado: 'ok', message: respuesta });           
    }catch (error){
         res.status(400).send({error: `Error al crear el producto: ${error}`});
    };
}); 

productRouter.put("/:pid", async (req, res) => {
    const {pid} = req.params
    const { title, description, stock, code, price, category, status } = req.body;
    
    try {
        const prod = await productModel.findByIdAndUpdate(pid, {
          title, description, stock, code, price, category, status
        });
      
        if (prod !== null && prod !== undefined) {
          res.status(200).send({ resultado: 'ok', message: prod });
        } else {
          res.status(404).send({ resultado: 'Not Found', message: 'Producto no encontrado' });
        }
      } catch (error) {
        res.status(400).send({ error: `Error al actualizar productos: ${error}` });
      }
}); 


productRouter.delete("/:pid", async (req, res)=>{
    const {pid} = req.params;
    
    try {
        const prod = await productModel.findByIdAndDelete(pid);
        
        if (prod)
            res.status(200).send({resultado: 'ok', message: prod });
        else
        res.status(404).send({resultado: 'Not Found', message: prod });
    
    }catch (error){
        res.status(400).send({error: `Error al eliminar producto: ${error}`});
    };
}); 

export default productRouter;