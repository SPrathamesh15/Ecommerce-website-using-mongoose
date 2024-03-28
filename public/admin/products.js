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

axios.get("http://localhost:3000/admin/products")
        .then(response => {
            const products = response.data.newProductDetails;
            const productGrid = document.getElementById('productGrid');
            console.log(products)
            products.forEach(product => {
                const article = document.createElement('article');
                article.className = 'card product-item';

                const header = document.createElement('header');
                header.className = 'card__header';
                const title = document.createElement('h1');
                title.className = 'product__title';
                title.textContent = product.title;
                header.appendChild(title);
                article.appendChild(header);

                const imageContainer = document.createElement('div');
                imageContainer.className = 'card__image';
                const image = document.createElement('img');
                image.src = product.imageUrl;
                image.alt = product.title;
                imageContainer.appendChild(image);
                article.appendChild(imageContainer);

                const content = document.createElement('div');
                content.className = 'card__content';
                const price = document.createElement('h2');
                price.className = 'product__price';
                price.textContent = '$' + product.price;
                const description = document.createElement('p');
                description.className = 'product__description';
                description.textContent = product.description;
                content.appendChild(price);
                content.appendChild(description);
                article.appendChild(content);

                const actions = document.createElement('div');
                actions.className = 'card__actions';
                const eidtButton = document.createElement('button');
                eidtButton.className = 'btn-edit';
                eidtButton.textContent = 'Edit';
                
                eidtButton.addEventListener('click', () => {
                    localStorage.setItem('editProductId', product._id);
                
                    window.location.href = `../add-products/products.html`;
                })

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn-delete';
                deleteButton.textContent = 'Delete';

                deleteButton.addEventListener('click', () => {
                    axios.post('http://localhost:3000/admin/delete-product', { productId: product._id })
                        .then(response => {
                            alert(`This ${product.title} has been removed!`);
                            productGrid.removeChild(article);
                        })
                        .catch(error => {
                            console.error('Error adding product to cart:', error);
                        });
                })
                actions.appendChild(eidtButton);
                actions.appendChild(deleteButton);
                article.appendChild(actions);

                productGrid.appendChild(article);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });