import fs from 'fs'

class CartManager {
    constructor(cart){
        this.path = cart;
        this.productsCart=[];
    }

    async newCartEmpty(){

        await this.getCart()

        const newCart = {            
        };

        
        if (this.productsCart.length === 0){
            newCart.idCart=1;
        }else{
            let mayorProdId=1;
            this.productsCart.forEach(product=>{
                
                if (product.id>mayorProdId){
                    mayorProdId=product.id;
                }                        
            })
            newCart.idCart=mayorProdId+1;
        }
        newCart.list=[];

        this.productsCart.push(newCart)

        await fs.promises.writeFile(this.path,JSON.stringify(this.productsCart),'utf-8')
        console.log("Carrito agregado")
        return newCart

    }

    async getCart(limit){
        const prodCart = await fs.promises.readFile(this.path,'utf-8')
        const prodParse = await JSON.parse(prodCart);
        this.productsCart = prodParse;

        return limit === 0 ? prodParse : prodParse.slice(0,limit);
    }

    async getCartId(id){
        await this.getCart()

        const cartId = this.productsCart.find(cart => cart.idCart === id)
        if (cartId){
            return cartId
        }else {
            return ("Not Found");
         }        
    }

    async addProductCart(cartId,productId){

        const cartProduct = await this.getCartId(cartId);

        if (cartProduct){

            const prodList = cartProduct.list

            const prodFilter = prodList.filter(prod => prod.idProduct === productId)

            // console.log('prodFilter',prodFilter)

            if (prodFilter.length>0){
                prodList.forEach(cart =>{ 
                    if (cart.idProduct === productId){
                        cart.quantity+=1;
                    }})
            } else {
                cartProduct.list.push({'idProduct':productId, 'quantity':1})
            }
            
            await fs.promises.writeFile(this.path,JSON.stringify(this.productsCart),'utf-8')
        }
        
        return (cartProduct)
    }

}

export default CartManager;