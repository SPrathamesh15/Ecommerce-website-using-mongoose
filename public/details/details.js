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

document.addEventListener("DOMContentLoaded", function() {
    const productId = localStorage.getItem('selectedProductId');

    if (!productId) {
        console.error('Product ID not found in URL');
        return;
    }

    axios.get(`http://localhost:3000/user/products/${productId}`)
        .then(response => {
            const product = response.data.Product;
            renderProductDetails(product);
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
});

function renderProductDetails(product) {
    const productDetailsContainer = document.getElementById('productDetailsContainer');

    const article = document.createElement('article');
    article.className = 'big_card product-item';

    const header = document.createElement('header');
    header.className = 'big_card__header';
    const title = document.createElement('h1');
    title.className = 'big_product__title';
    title.textContent = product.title;
    header.appendChild(title);
    article.appendChild(header);

    const imageContainer = document.createElement('div');
    imageContainer.className = 'big_card__image';
    const image = document.createElement('img');
    image.src = product.imageUrl;
    image.alt = product.title;
    imageContainer.appendChild(image);
    article.appendChild(imageContainer);

    const content = document.createElement('div');
    content.className = 'big_card__content';
    const price = document.createElement('h2');
    price.className = 'big_product__price';
    price.textContent = '$' + product.price;
    const description = document.createElement('p');
    description.className = 'big_product__description';
    description.textContent = product.description;
    content.appendChild(price);
    content.appendChild(description);
    article.appendChild(content);

    productDetailsContainer.appendChild(article);
}
