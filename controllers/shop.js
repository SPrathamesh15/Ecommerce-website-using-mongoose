const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products)
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log('productId ',prodId)
  // this findById method is provided by the mongoose 
  Product.findById(prodId)
    .then(product => {
      res.status(201).json({ Product: product });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      console.log(user.cart.items)
      res.status(201).json({ Cart: user.cart.items });
      const products = user.cart.items
        })
      
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
      .then(result => {
        console.log('post add to cart', result)
        res.status(201).json({ addToCart: result });
      })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.status(201).json({ deleteCartItem: result });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      console.log(user.cart.items)
      const products = user.cart.items.map(i => {
          return { quantity: i.quantity, product: { ...i.productId._doc }}
      })

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      })
      return order.save()
    })
    .then(result => {
      res.status(201).json({ createdOrder: result });
      return req.user.clearCart()
    })
    .then(()=> {
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.status(201).json({ Orders: orders });
    })
    .catch(err => console.log(err));
};
