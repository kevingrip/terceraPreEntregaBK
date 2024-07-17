import { Router } from "express";
import config from '../config.js'

const router = Router();

router.get ('/setcookie', async (req,res) =>{
    try{
        res.cookie('codercookie','este es el contenido de la cookie',{maxAge:10000});
        res.status(200).send({ origin:config.SERVER, payload: 'Cookie generada'});
    }catch(err){
        res.status(500).send({ origin:config.SERVER, payload: null, error: err.message })
    }
})

export default router;