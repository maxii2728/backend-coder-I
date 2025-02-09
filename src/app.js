import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const httpServer = app.listen(8086, () => {
    console.log("Listening on PORT 8086");
});

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

const socketServer = new Server(httpServer);
let products = [];

socketServer.on('connection', (socket) => {
    console.log("Nuevo cliente conectado");
    socket.emit('loadProducts', products);

    socket.on('newProduct', (product) => {
        products.push(product);
        socketServer.emit('loadProducts', products);
    });

    socket.on('deleteProduct', (productId) => {
        products = products.filter(p => p.id !== productId);
        socketServer.emit('loadProducts', products);
    });
});