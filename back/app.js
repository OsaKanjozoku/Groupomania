const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const stuffRoutes = require('./routes/stuff');
const postRoutes = require('./routes/post');
const path = require('path');
const multer = require('multer');


const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images/')
    },
    filename: (req, file, callback) => {
        const name = file.originalname;
        console.log(name)
        const extension = MIME_TYPES[file.mimetype];
        callback(null, Date.now() + "-" + name);
    }
});


mongoose.connect('mongodb+srv://OsaKanjozoku:TgYrUkoYClD95BD5@groupomania.n4idpuk.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();
  app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.post('/image', (req, res) => {
  const images = multer({ storage: storage, dest: 'images/' }).single('image');
    images(req, res, function(err, result) {

      if (!req.file){
        res.send({code: 500, msg: 'error'})

        } else {
          res.send({code: 200, msg: 'success', imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
        }
    });
  });
app.use('/groupomania/users', stuffRoutes);
app.use('/groupomania/auth', userRoutes);
app.use('/groupomania/posts', postRoutes);


module.exports = app;