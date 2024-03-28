const activePage = window.location.pathname;
const navLinks = document.querySelectorAll('nav a').forEach(link => {
    if(link.href.includes(`${activePage}`)){
        link.classList.add('active')
    }
})
function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = count;
    localStorage.setItem('cartCount', count);
}

document.addEventListener('DOMContentLoaded', () => {
    const storedCount = localStorage.getItem('cartCount');
    if (storedCount !== null) {
        updateCartCount(parseInt(storedCount));
    }
});

axios.get("http://localhost:3000/user/orders")
    .then(response => {
        const orders = response.data.Orders;
        const ordersContainer = document.getElementById('ordersContainer');
        
        orders.forEach(order => {
            const orderItem = document.createElement('li');
            orderItem.className = 'orders__item';

            const orderTitle = document.createElement('h1');
            orderTitle.textContent = `Order - OrderId: ${order._id}`; 
            orderItem.appendChild(orderTitle);

            const productsList = document.createElement('ul');
            productsList.className = 'orders__products';

            order.products.forEach(product => {
                const productItem = document.createElement('li');
                productItem.className = 'orders__products-item';
                productItem.textContent = `${product.product.title} (Quantity ${product.quantity})`; 
                productsList.appendChild(productItem);
            });

            orderItem.appendChild(productsList);
            ordersContainer.appendChild(orderItem);
        });
    })
    .catch(error => {
        console.error('Error fetching orders:', error);
    });

