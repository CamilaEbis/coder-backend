import bcrypt from 'bcrypt'

//encriptar contraseña 
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt (process.env.SALT)))

//validar contraseña encriptada 
export const validatePassword= (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)