import fs from 'fs'

class ProductManager {

    constructor(file){
        this.path = file;
        this.products=[];
    }
 
    async addProduct(title,description,price,thumbnail,code,stock){

        await this.getProducts()
        
    
        const product = {
            title,description,price,thumbnail,code,stock
        }

        if (title && description && price && thumbnail && code && stock){

            product.status = true;

            const productCodes = this.products.map(prod =>prod.code);

            if (!productCodes.includes(code)){
                if (this.products.length === 0){
                    product.id=1;
                }else{
                    let mayorProdId=1;
                    this.products.forEach(product=>{
                        
                        if (product.id>mayorProdId){
                            mayorProdId=product.id;
                        }                        
                    })
                    product.id=mayorProdId+1;                    
                }
                
                this.products.push(product)
                await fs.promises.writeFile(this.path,JSON.stringify(this.products),'utf-8')
                console.log("Producto agregado",code)
            }
            else{
                console.log("El codigo ya esta agregado",code)
            }
        }        
    }

    async getProducts(limit){
        const products = await fs.promises.readFile(this.path,'utf-8')
        const convProd = await JSON.parse(products);
        this.products = convProd;

        return limit === 0 ? convProd : convProd.slice(0,limit);
    }

    async getProductsById(id) {
        await this.getProducts()

        const product = this.products.find(product => product.id === id);
         if (product) {
            return product;
         } else {
            return ("Not Found");
         }
    }

    async deleteProductId(id){
        await this.getProducts();
        const deleteProduct = this.products.find(product => product.id === id);
        if (deleteProduct){
            const filteredProduct = this.products.filter(product => product.id != id);
            await fs.promises.writeFile(this.path,JSON.stringify(filteredProduct),'utf-8')
            console.log("Producto borrado ID: "+id)
            return ("Producto borrado ID: "+id)
        }else{
            return ("ID no encontrado")
        }
    }

    async updateProduct(act) {
        const prod = await this.getProductsById(act.id);

        if (prod!="Not Found"){
            for (let key in act) {
                if (key in prod) {
                    if (key!='id'){
                        prod[key] = act[key];
                    }                    
                }
            }
            await fs.promises.writeFile(this.path,JSON.stringify(this.products),'utf-8')
            console.log("Producto actualizado correctamente")
        }
        else{
            console.log ("Not Found")
        }
    }
        
}

export default ProductManager;

// const fileJson = './file2.json'
// const productManager = new ProductManager(fileJson);


// await productManager.addProduct('Estator', 'Conversión electromecánica de potencia', 25000, 'https://luzplantas.com/wp-content/uploads/2013/04/Estator-de-bobinas-de-generaci%C3%B3n.jpg',"c1", 10);
// await productManager.addProduct('Asiento', 'Superficie para sentarse en la moto', 50000, 'https://http2.mlstatic.com/D_NQ_NP_749755-MLA51616305014_092022-O.webp',"c2", 10);
// await productManager.addProduct('Escape', 'Evacuador de gases del motor hacia el medioambiente', 60000, 'https://http2.mlstatic.com/D_NQ_NP_993357-MLA53248445597_012023-O.webp',"c3",30);

// console.log(await productManager.getProducts());

// console.log(await productManager.getProductsById(1))

// console.log(await productManager.deleteProductId(2))

// await productManager.updateProduct ({id:1,stock:20})