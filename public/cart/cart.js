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
    const handleFormSubmit = (event) => {
        event.preventDefault();

        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        axios.post('http://localhost:3000/user/create-order', { cartItems })
            .then(response => {
                alert('Order Created!')
                console.log('Order created:', response.data.createdOrder);

                localStorage.removeItem('cartItems');
                updateCartCount(0); 
            })
            .catch(error => {
                console.error('Error creating order:', error);
            });
    };

    const orderForm = document.querySelector('form[action="/create-order"]');

    if (orderForm) {
        orderForm.addEventListener('submit', handleFormSubmit);
    }
});


axios.get('http://localhost:3000/user/cart')
    .then(response => {
        const cartItems = response.data.Cart;
        console.log(cartItems);
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartItemList = document.createElement('ul');

        cartItemList.className = 'cart__item-list';

        cartItemsContainer.innerHTML = '';

        cartItems.forEach(item => {
            const cartItemElement = document.createElement('li');
            cartItemElement.className = 'cart__item';
            console.log(item.productId.title);
            const title = document.createElement('h1');
            title.textContent = item.productId.title;
            cartItemElement.appendChild(title);

            const quantity = document.createElement('h2');
            quantity.textContent = `Quantity: ${item.quantity}`;
            cartItemElement.appendChild(quantity);

            const form = document.createElement('form');

            const input = document.createElement('input');
            input.type = 'hidden';
            input.value = item.productId;
            input.name = 'productId';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-delete';
            deleteButton.textContent = 'Delete';

            form.appendChild(input);
            form.appendChild(deleteButton);

            deleteButton.addEventListener('click', () => {
                axios.post('http://localhost:3000/user/cart-delete-item', { productId: item.productId._id })
                        .then(response => {
                            alert(`This ${item.productId.title} has been removed from cart`);
                            console.log('Product added to cart:', response.data.deleteCartItem);
                            cartItemList.removeChild(cartItemElement);
                            updateCartCount(cartItems.length - 1);
                        })
                        .catch(error => {
                            console.error('Error adding product to cart:', error);
                        });
            })
            cartItemElement.appendChild(form);

            cartItemList.appendChild(cartItemElement);
        });

        cartItemsContainer.appendChild(cartItemList);

        updateCartCount(cartItems.length);
    })
    .catch(error => {
        console.error('Error fetching cart items:', error);
    });

