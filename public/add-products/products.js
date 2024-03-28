const activePage = window.location.pathname;
const navLinks = document.querySelectorAll('nav a').forEach(link => {
    if(link.href.includes(`${activePage}`)){
        link.classList.add('active')
    }
})

const form = document.getElementById('addForm')

form.addEventListener('submit', handleFormSubmission)

document.addEventListener('DOMContentLoaded', () => {
    const editProductId = localStorage.getItem('editProductId');

    if (editProductId) {
        axios.get(`http://localhost:3000/admin/edit-product/${editProductId}`)
            .then(response => {
                const product = response.data.editeditedProduct;
                console.log(product.description)
                const titleInput = document.getElementById('title');
                const priceInput = document.getElementById('price');
                const imageInput = document.getElementById('image-url');
                const descriptionInput = document.getElementById('description');

                // Populating input fields with product data
                titleInput.value = product.title;
                priceInput.value = product.price;
                imageInput.value = product.imageUrl;
                descriptionInput.value = product.description;
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }
});


function handleFormSubmission(e){
    e.preventDefault();
    var title = document.getElementById('title').value;
    var imageUrl = document.getElementById('image-url').value
    var price = document.getElementById('price').value
    var description = document.getElementById('description').value
    const editProductId = localStorage.getItem('editProductId');
    const productDetails = {
        productId: editProductId,
        Title: title,
        ImageURL: imageUrl,
        Price: price,
        Description: description
    }
    
    if (editProductId) {
        console.log('product',productDetails)
        axios.post(`http://localhost:3000/admin/edit-product`, productDetails)
            .then(response => {
                console.log('Update product result', response);
                alert('Product Updated!');
                localStorage.removeItem('editProductId');
            })
            .catch(error => {
                console.error('Update product error:', error);
            });
    } else {
        axios.post("http://localhost:3000/admin/add-product", productDetails)
            .then(response => {
                console.log('Add product result', response);
                alert('Product Added!');
            })
            .catch(error => {
                console.error('Add product error:', error);
            });
    }
}
