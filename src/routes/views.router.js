import { Router } from 'express';
import ProductManager from '../fileManager/productsManager.js';

const router = Router();
const productManager = new ProductManager();

// Vista principal
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', { products });
});

// Vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

// Vista de registro
router.get('/registro', (req, res) => {
    res.render('registro');
});

export default router;