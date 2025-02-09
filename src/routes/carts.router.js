import { Router } from 'express';
import CartManager from '../fileManager/cartManager.js';

const router = Router();
const cartManager = new CartManager();

// Crear un carrito
router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).send({ status: "success", cart: newCart });
});

// Obtener productos de un carrito
router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (cart) {
        res.render('cart', { cart });
    } else {
        res.status(404).send({ status: "error", message: "Carrito no encontrado" });
    }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (updatedCart) {
        res.redirect(`/cart/${req.params.cid}`); // Redirigir a la vista del carrito
    } else {
        res.status(404).send({ status: "error", message: "Carrito o producto no encontrado" });
    }
});

export default router;