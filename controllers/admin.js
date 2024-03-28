const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  try{
  const Title = req.body.Title;
  const ImageURL = req.body.ImageURL;
  const Price = req.body.Price;
  const Description = req.body.Description;
  console.log(req)
  const product = new Product({
    title: Title,
    price: Price,
    description: Description,
    imageUrl: ImageURL,
    userId: req.user
  });
  console.log('product:', product)
  product
    .save()
    .then(result => {
      console.log('Created Product');
    })
    .catch(err => {
      console.log(err);
    });
    res.status(201).json({ newProductDetails: product });
    console.log('Produtcs added to server');
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.status(201).json({ editeditedProduct: product });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
      console.log(err)
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.Title;
  const updatedPrice = req.body.Price;
  const updatedImageUrl = req.body.ImageURL;
  const updatedDesc = req.body.Description;
  console.log(prodId, updatedDesc, updatedImageUrl, updatedPrice, updatedTitle)
  Product.findById(prodId).then(product => {
    product.title = updatedTitle,
    product.price = updatedPrice,
    product.description = updatedDesc,
    product.imageUrl = updatedImageUrl
    return product.save()
  })
    .then(result => {
      res.status(201).json({ postEditProduct: result });
      console.log('UPDATED PRODUCT!');
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
      console.log(err)
    });
};

exports.getProducts = (req, res, next) => {
  //find is also a method provided by mongoose
  Product.find()
  // we can retreive the specific data we want in this case only title and price is getting called and not the id 
    // .select('title price -_id')
    // we can populate the data by mentioning the userId and from the userId we can retrieve the users detail if we not specify the name then it will retrieve all the info of the users
    // .populate('userId', 'name')
    .then(products => {
      console.log(products)
      res.status(201).json({ newProductDetails: products });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
    .then((response) => {
      console.log('DESTROYED PRODUCT');
      res.status(201).json({ deletedProduct: response });
    })
    .catch(err => console.log(err));
};
