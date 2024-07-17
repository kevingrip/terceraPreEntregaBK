import bcrypt from 'bcrypt';


//creo el hash de la clave plana
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));


//comparo la password ingresada con la hasheada / user es el objeto completo que me traigo
export const isValidPassword = (password, hash) => bcrypt.compareSync(password, hash)