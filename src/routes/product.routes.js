import { Router } from "express";
import { uploader } from "../uploader.js";
import ProductManager from "../dao/productManager.js";
import ProductCollectionManager from "../dao/ProductManagerMdb.js";

const productRoutes = Router();

const productJson = './src/product.json'

const manager = new ProductManager(productJson);
const dbManager = new ProductCollectionManager();


// productRoutes.get('/',async (req,res)=>{
//     const limit = parseInt(req.query.limit) || 0;
//     const products = await manager.getProducts(limit)
//     res.status(200).send({ status: 1, payload: products})
// })

// productRoutes.get('/',async (req,res)=>{
//     // const productsFromDb = await productModel.find();
//     const productsFromDb = await dbManager.getAllProductsDB()
//     res.status(200).send({ status: 1, payload: productsFromDb})
// })

productRoutes.get('/',async (req,res)=>{
    const page = req.query.page
    const limit = req.query.limit
    const sort =  req.query.sort
    const category = req.query.query
    const productsFromDb = await dbManager.getAllProductsDB(page,limit,sort,category)
    res.status(200).send({ status: 1, payload: productsFromDb})
})

productRoutes.get('/:pid', async(req,res) => {
    const productId = req.params.pid;
    // const product = await manager.getProductsById(productId)
    // res.status(200).send({ status: 2, payload: product})
    const productsFromDb = await dbManager.getProductByIdDB(productId);
    res.status(200).send({ status: 2, payload: productsFromDb})

})

productRoutes.post('/', uploader.single('thumbnail'), async(req,res) => {
    const socketServer = req.app.get('socketServer');

    console.log(req.file);
    console.log(req.body);
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const price = parseInt(req.body.price);
    const thumbnail = `/static/img/${req.file.originalname}`
    const code = req.body.code;
    const stock = parseInt(req.body.stock);

    // console.log(`${config.DIRNAME}public/img/${req.file.originalname}`)

    await dbManager.addProductDB(title, description, price, thumbnail,code,stock,category);
    res.status(200).send({ status:3, payload: req.body });
    socketServer.emit('newProduct', "Producto agregado");
        
    // await manager.addProduct(title, description, price, thumbnail,code,stock);
    // res.status(200).send({ status:3, payload: req.body });
    
})

productRoutes.delete('/:pid',async(req,res) => {
    const socketServer = req.app.get('socketServer');

    const productId = req.params.pid;

    // const deleteProduct = await manager.deleteProductId(productId)    
    // res.status(200).send({ status: 4, payload: deleteProduct})    

    const deleteProductsFromDb = await dbManager.deleteProductDB(productId)    
    res.status(200).send({ status: 4, payload: deleteProductsFromDb})    

    socketServer.emit('deleteProduct', "Producto borrado")

})

productRoutes.put('/:pid', uploader.single('thumbnail'),async(req,res) => {
    const productId = req.params.pid;
    const update = req.body
    update.idMdb = productId
    // await manager.updateProduct(update)
    // res.status(200).send({ status: 5, payload: update})
    console.log(update)
    const updateProductsFromDb = await dbManager.updateProductDB(update)
    res.status(200).send({ status: 5, payload: updateProductsFromDb})

})


export default productRoutes;