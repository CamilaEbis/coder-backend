import { Router } from "express";
import { userModel } from "../models/users.models.js";

const userRouter = Router()

userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send({ error: `Error al consultar users:  ${error}` })
    }
})

userRouter.post('/', async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body
    try{
        const resultado = await userModel.create(
            { first_name, last_name, email, password, age })
        res.status(200).send(resultado)
    } catch (error) {
        res.status(400).send({ error: `Error al crear users:  ${error}` })
    }
})

export default userRouter