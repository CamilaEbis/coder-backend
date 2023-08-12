import {promises as fs} from 'fs';

class ProductManager{
    constructor() {
        this.products = [];
        this.path = "Products.txt";
    
    }


    addProduct(product) {
        if (this.validateCode(product.code)) {
            return console.log("Este code ya existe!");
        } else {
            const producto = {id:this.generateId(), title:product.title, description:product.description, price:product.price, thumbnail:product.thumbnail, code:product.code, stock:product.stock};
            this.products.push(producto);
            this.saveProducts();
            return console.log("Producto agregado!");
        }
    }

    updateProduct(id, product) {
        this.products = this.getProducts();
        const indice = this.products.findIndex(item => item.id === id);

        if (indice > -1) {
            this.products[indice].title = product.title;
            this.products[indice].description = product.description;
            this.products[indice].price = product.price;
            this.products[indice].thumbnail = product.thumbnail;
            this.products[indice].code = product.code;
            this.products[indice].stock = product.stock;
            this.saveProducts();
            return console.log("Product updated!");
        } else {
            return console.log("Producto no encontrado!");
        }
    }

    deleteProduct(id) {
        this.products = this.getProducts();
        let indice = this.products.findIndex(item => item.id === id);

        if (indice > -1) {
            this.products.splice(indice, 1); (0,1)
            this.saveProducts();
            return console.log("Product #" + id + " deleted!");
        } else {
            return console.log("Not found!");
        }
    }

    async getProducts(limit = undefined) {
        let products = JSON.parse(await fs.readFile(this.path, "utf-8"));
        if(limit) {
            return products.slice(0, limit)
        }
        return products;
    }

    async getProductById(id) {
        this.products = JSON.parse(await fs.readFile(this.path, "utf-8"));

        return this.products.find(item => item.id === id) || "Producto no existe";
    }

    validateCode(code) {
        return this.products.some(item => item.code === code);
    }

    generateId() {
        let max = 0;

        this.products.forEach(item => {
            if (item.id > max) {
                max = item.id;
            }
        });

        return max+1;
    }

    async saveProducts() {
        await fs.writeFile(this.path, JSON.stringify(this.products));
    }
}

export default ProductManager;