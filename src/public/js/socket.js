const socket = io();

// Cargar productos al cargar la página
socket.on('loadProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpiar la lista actual
    products.forEach(product => {
        const div = document.createElement('div');
        div.style.border = '1px solid #ccc';
        div.style.margin = '10px';
        div.style.padding = '10px';
        div.style.width = '200px';
        div.innerHTML = `
            <h2>${product.title}</h2>
            <p>Precio: ${product.price}</p>
            <p>Descripción: ${product.description}</p>
            <button onclick="addToCart('${product.id}')">Añadir al Carrito</button>
            <button onclick="deleteProduct('${product.id}')">Eliminar</button>
        `;
        productList.appendChild(div);
    });
});

// Agregar producto
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const formData = new FormData(e.target);
    const product = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category'),
        id: Date.now().toString() // Generar un ID único
    };
    socket.emit('newProduct', product); // Emitir evento para agregar nuevo producto
    e.target.reset(); // Reiniciar el formulario
});

// Función para eliminar producto
function deleteProduct(productId) {
    socket.emit('deleteProduct', productId); // Emitir evento para eliminar producto
}

// Función para agregar al carrito
function addToCart(productId) {
    // Aquí puedes implementar la lógica para agregar al carrito
    console.log(`Producto ${productId} añadido al carrito`);
}