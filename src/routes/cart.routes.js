import { Router } from "express";
import CartManager from "../dao/cartManager.js";
import CartCollectionManager from "../dao/cartManagerMdb.js";

const cartRoutes = Router();

// const cartJson = './src/carts.json'
// const cManager = new CartManager(cartJson);

const dbCartManager = new CartCollectionManager()

cartRoutes.get('/',async (req,res)=>{
    const limit = parseInt(req.query.limit) || 0;
    // const products = await cManager.getCart(limit)
    const products = await dbCartManager.getAllCart(limit)
    res.status(200).send({ status: 1, payload: products})
})

cartRoutes.get('/:cid', async(req,res) => {
    const productId = req.params.cid;
    // if (productId <= 0 || isNaN(productId)) {
    //     res.status(400).send({ status: 0, payload: [], error: 'Se requiere id numérico mayor a 0' });
    // }else{
        // const product = await cManager.getCartId(productId)
        const product = await dbCartManager.getCartById(productId)
        res.status(200).send({ status: 2, payload: product})
    // }
    
})

cartRoutes.post('/', async(req,res) => {
    console.log(req.body);
    const cartEmpty = await dbCartManager.addEmptyCart();
    res.status(200).send({ status:3, payload: cartEmpty });
})

cartRoutes.post('/:cid/product/:pid', async(req,res) => {

    const cartId = req.params.cid;
    const prodId = req.params.pid;

    const addProd = await dbCartManager.addProductCart(cartId,prodId);
    res.status(200).send({ status:4, payload: addProd });
})

cartRoutes.put('/:cid/product/:pid/:quantity', async(req,res)=>{
    const cartId = req.params.cid
    const prodId = req.params.pid;
    const quantity = req.params.quantity;
    const productCartUpdate = await dbCartManager.updateQuantity(cartId,prodId,quantity)
    res.status(200).send({ status:3, payload: productCartUpdate });
} )

cartRoutes.delete('/:cid', async(req,res)=>{
    const cartId = req.params.cid;
    const cartDeleteById = await dbCartManager.deleteProductsFromCart(cartId);
    res.status(200).send({ status:3, payload: cartDeleteById });
} )

cartRoutes.delete('/:cid/product/:pid', async(req,res)=>{
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const prodDeleteByCart = await dbCartManager.deleteProdByCart(cartId,prodId);
    res.status(200).send({ status:3, payload: prodDeleteByCart });
} )

export default cartRoutes;