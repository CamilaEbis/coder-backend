import {promises as fs} from 'fs';

class ProductManager{
    constructor() {
        this.products = [];
        this.path = "Products.txt";
    
    }


    addProduct(product) {
        if (this.validateCode(product.code)) {
            console.log("Este code ya existe!");
        } else {
            const producto = {id:this.generateId(), title:product.title, description:product.description, price:product.price, thumbnail:product.thumbnail, code:product.code, stock:product.stock};
            this.products.push(producto);
            this.saveProducts();
            console.log("Producto agregado!");
        }
    }

    updateProduct(id, product) {
        this.products = this.getProducts();
        let indice = this.products.findIndex(item => item.id === id);

        if (indice > -1) {
            this.products[indice].title = product.title;
            this.products[indice].description = product.description;
            this.products[indice].price = product.price;
            this.products[indice].thumbnail = product.thumbnail;
            this.products[indice].code = product.code;
            this.products[indice].stock = product.stock;
            this.saveProducts();
            console.log("Product updated!");
        } else {
            console.log("Producto no encontrado!");
        }
    }

    deleteProduct(id) {
        this.products = this.getProducts();
        let indice = this.products.findIndex(item => item.id === id);

        if (indice > -1) {
            this.products.splice(indice, 1); (0,1)
            this.saveProducts();
            console.log("Product #" + id + " deleted!");
        } else {
            console.log("Not found!");
        }
    }

    async getProducts() {
        let products = JSON.parse(await fs.readFile(this.path, "utf-8"));

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