const express = require('express');
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('../middleware/multer-config');
const router = express.Router();



router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.createPost);
router.post('/like/:id', auth, postCtrl.like)
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deleteOnePost);
router.delete('/admin/:id', admin, postCtrl.deleteOnePostAdmin);
router.put('/image/:id', postCtrl.deleteImage);

module.exports = router;