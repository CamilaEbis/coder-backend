import { Router } from "express";
import CartManager from "../controllers/cartManager.js";

const cartsRouter = Router();
const cartManager = new CartManager('src/models/Carts.txt');

cartsRouter.post("/", async (req, res) => {
    if (await cartManager.addCart(req)) {
        res.send({status:"ok", message:"El Carrito se creó correctamente!"});
    } else {
        res.status(500).send({status:"error", message:"Error! No se pudo crear el Carrito!"});
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const cid = Number(req.params.cid);
    const cart = await cartManager.getCartById(cid);

    if (cart) {
        res.send({products:cart.products});
    } else {
        res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    const cart = await cartManager.getCartById(cid);

    if (cart) {
        if (await cartManager.addProductToCart(cid, pid)) {
            res.send({status:"ok", message:"El producto se agregó correctamente!"});
        } else {
            res.status(400).send({status:"error", message:"Error! No se pudo agregar el Producto al Carrito!"});
        }
    } else {
        res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
    }
});

export default cartsRouter;