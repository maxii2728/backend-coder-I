import fs from 'fs/promises';
import path from 'path';
import ProductManager from './productsManager.js';

const cartsFilePath = path.join(process.cwd(), 'src', 'fileManager', 'data', 'carts.json');
const productManager = new ProductManager();

class CartManager {
    static carts = [];

    async getCarts() {
        if (CartManager.carts.length === 0) {
            try {
                const data = await fs.readFile(cartsFilePath, 'utf-8');
                CartManager.carts = JSON.parse(data) || [];
            } catch (error) {
                CartManager.carts = [];
            }
        }
        return CartManager.carts;
    }

    async getCartById(cid) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === cid) || null;
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: (carts.length + 1).toString(), products: [] };
        carts.push(newCart);
        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cid);
        if (cartIndex === -1) return null;

        const product = await productManager.getProductById(pid);
        if (!product) return null;

        const productIndex = carts[cartIndex].products.findIndex(p => p.product === pid);
        if (productIndex !== -1) {
            carts[cartIndex].products[productIndex].quantity += 1;
        } else {
            carts[cartIndex].products.push({ product: pid, quantity: 1 });
        }

        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
        return carts[cartIndex];
    }
}

export default CartManager;