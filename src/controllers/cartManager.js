import {promises as fs} from 'fs';

class CartManager{
    constructor(path) {
        this.carts = [];
        this.path = path;
    }


    addCart(cart) {
        if (this.validateCode(cart.code)) {
            return false;
        } else {
            this.carts.push({id:this.generateId(), products:[]});
            this.saveCarts();
            return true;
        }
    }

    async addProductToCart(cid, pid) {
        this.carts = await this.getCarts();
        const cart = this.carts.find(item => item.id === cid);
        let product = cart.products.find(item => item.product === pid);

        if (product) {
            product.quantity+= 1;
        } else {
            cart.products.push({product:pid, quantity:1});
        }

        await this.saveCarts();
        console.log("Product added!");

        return true;
    }

    

    async getCarts() {
        return JSON.parse(await fs.readFile(this.path, "utf-8"));
    }

    async getCartById(id) {
        this.carts = JSON.parse(await fs.readFile(this.path, "utf-8"));

        return this.carts.find(item => item.id === id);
    }



    generateId() {
        let max = 0;

        this.carts.forEach(item => {
            if (item.id > max) {
                max = item.id;
            }
        });

        return max+1;
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts));
    }

    validateCode(code) {
        return this.carts.some(item => item.code === code);
    }

}

export default CartManager;