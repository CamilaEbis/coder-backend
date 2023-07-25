
class ProductManager{
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        if (this.validateCode(product.code)) {
            console.log("Este code ya existe!");
        } else {
            const producto = {id:this.generateId(), title:product.title, description:product.description, price:product.price, thumbnail:product.thumbnail, code:product.code, stock:product.stock};
            this.products.push(producto);
            console.log("Producto agregado!");
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(item => item.id === id) || "Not found";

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
}

const test = new ProductManager();

function myFunction() {
    const objPrducto = {
        title: 'producto prueba',
        code: 'abc123',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'sin imagen',
        stock: 25
    }
    
    console.log(test.getProducts());

    test.addProduct(objPrducto);
    objPrducto.code++;
    test.addProduct(objPrducto);
    console.log(test.getProducts());
    test.addProduct(objPrducto);

    console.log(test.getProductById(1));

}

myFunction()