import { Router } from "express";
import { uploader } from "../uploader.js";

const router = Router();

const data = {
    nombre:"Kevin",
    age: 26
}

router.get('/',(req,res)=>{
    res.status(200).send({status:'OK',payload:data})
})

router.post('/', uploader.single('thumbnail'), (req,res)=>{
    console.log(req.file);
    console.log(req.body);
    const body = req.body;
    res.status(200).send({status:'OK',payload: body})
})

export default router;