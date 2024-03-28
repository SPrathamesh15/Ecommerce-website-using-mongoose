const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

// Middleware to fetch user by ID
app.use((req, res, next) => {
  User.findById("65eae38107c93241f71e54d6")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use('/user',shopRoutes);

app.use((req, res, next) => {
  if (req.method === 'GET') {
    console.log('URL: ', req.url);
    res.sendFile(path.join(__dirname, `public/${req.url}`));
  } else {
    next();
  }
});


mongoose.connect(
  `mongodb+srv://${process.env.MONGODBUSERNAME}:${process.env.PASSWORD}@cluster0.brta1me.mongodb.net/shop`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(result => {
  User.findOne().then(user => {
    if (!user) {
      const user = new User({
        name: `${process.env.NAME}`,
        email: `${process.env.EMAIL}`,
        items: []
      })
      user.save()
    }
  })
  app.listen(3000)
  console.log("Connected!")
})
.catch(err => {
  console.log(err)
})
