const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const errorController = require('./controllers/error');
// const User = require('./models/user')
const app = express();

const dotenv = require('dotenv')
dotenv.config()

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById("65e965181542626a6ae60e02")
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
.connect(
  `mongodb+srv://${process.env.MONGODBUSERNAME}:${process.env.PASSWORD}@cluster0.brta1me.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(result => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
