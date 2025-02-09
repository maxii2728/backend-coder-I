import fs from 'fs/promises';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src', 'fileManager', 'data', 'products.json');

class ProductManager {
    static products = [];

    async getProducts() {
        if (ProductManager.products.length === 0) {
            try {
                const data = await fs.readFile(productsFilePath, 'utf-8');
                ProductManager.products = JSON.parse(data) || [];
            } catch (error) {
                ProductManager.products = [];
            }
        }
        return ProductManager.products;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(prod => prod.id === id) || null;
    }

    async addProduct(productData) {
        const products = await this.getProducts();
        const newProduct = { id: (products.length + 1).toString(), ...productData };
        products.push(newProduct);
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updateData) {
        let products = await this.getProducts();
        const index = products.findIndex(prod => prod.id === id);

        if (index !== -1) {
            products[index] = { ...products[index], ...updateData, id };
            await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
            return products[index];
        }
        return null;
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const newProducts = products.filter(prod => prod.id !== id);

        if (products.length === newProducts.length) return false;

        await fs.writeFile(productsFilePath, JSON.stringify(newProducts, null, 2));
        return true;
    }
}

export default ProductManager;