const Post = require('../models/post');
const fs = require('fs');
const adminId = "63371a5928d7ea88285f5eed";

exports.getAllPosts = (req, res, next) => {
  Post.find()
    .then(post => res.status(200).json(post.sort((a, b) => (a.date < b.date) ? 1 : -1)))
    .then(console.log('Affichage de tous les posts !'))
    .catch(error => res.status(403).json({ error }));
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => res.status(200).json(post))
    .then(console.log('Post unique affiché !'))
    .catch(error => res.status(403).json({ error }));
};

exports.createPost = (req, res) => {
  const PostObject = req.body;
  console.log(PostObject)
  delete PostObject.userId;
  const initialisation = {
    likes: 0,
    usersLiked: [],
  }
  const post = new Post({
    ...PostObject,
    _id: PostObject._id,
    userId: req.auth.userId,
    date: Date.now(),
    ...initialisation
  });

  post.save()
    .then(() => { res.status(201).json({ message: 'Nouveau post ajouté !' }) })
    .then(console.log('Nouveau post créé !'))
    .catch(error => { res.status(403).json({ error }) })
};

exports.like = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      let voteUtilisateur;
      let userIdVote = req.auth.userId;
      let like = post.usersLiked;
      let liked = like.includes(userIdVote);
      if (liked === true) {
        voteUtilisateur = 1;
      } else {
        voteUtilisateur = 0;
      };


      if (voteUtilisateur === 0 && req.body.like === 1) {
        post.likes += 1;
        post.usersLiked.push(userIdVote);
      } else if (voteUtilisateur === 1 && req.body.like === 0) {
        post.likes -= 1;
        const nouveauUsersLiked = like.filter((users) => users != userIdVote);
        post.usersLiked = nouveauUsersLiked;
      } else {
        console.log("tentavive de vote non autorisée !");
      };

      Post.updateOne(
        { _id: req.params.id },
        {
          likes: post.likes,
          usersLiked: post.usersLiked,
        }
      )
        .then(() => res.status(201).json({ message: "Vous venez de voter" }))
        .then(console.log('Vote prit en compte !'))
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    })
    .catch((error) => res.status(403).json({ error }));
};

exports.modifyPost = (req, res) => {
  const PostObject = req.file ? {
    ...JSON.parse(req.body.post),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  } : {
    ...(req.body),
  };

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (req.auth.userId === adminId){
        if (post.imageUrl === null || post.imageUrl === undefined){
          //post.imageUrl === undefined 
            Post.updateOne({ _id: req.params.id }, { ...PostObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Post modifié avec succès !' }))
              .catch(error => res.status(403).json({ error }));
        } else {
          //post.imageUrl => vérification PostObject.imageUrl
            const filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
            Post.updateOne({ _id: req.params.id }, { ...PostObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Post modifié avec succès !' }))
              .catch(error => res.status(403).json({ error }));
          });
        }
      } else {
        if (post.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non autorisé !' });
        } else {
          if (post.imageUrl === null || post.imageUrl === undefined){
            //post.imageUrl === undefined             
              Post.updateOne({ _id: req.params.id }, { ...PostObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Post modifié avec succès !' }))
                .catch(error => res.status(403).json({ error }));            
          } else {
            //post.imageUrl => vérification PostObject.imageUrl
              const filename = post.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
              Post.updateOne({ _id: req.params.id }, { ...PostObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Post modifié avec succès !' }))
                .catch(error => res.status(403).json({ error }));
            });
          }
        }
      }
    })
  };

  exports.deleteImage = (req, res) => {
    Post.findOne({ _id: req.params.id })
    .then(post => {
      const filename = post.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Post.updateOne({ _id: req.params.id }, { imageUrl: null, _id: req.params.id })
          .then(() => res.status(201).json({ message: 'Photo supprimée !' }))
          .catch(error => res.status(403).json({ error }));
      });

    })
    .catch(error => res.status(403).json({ error }));
    
  };



exports.deleteOnePost = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
        if ( post.userId != req.auth.userId){
          res.status(401).json({message : Non-autorisé})
        } else {
          if (post.imageUrl === null || post.imageUrl === undefined){
            Post.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .then(console.log("Post supprimé avec succès"))
            .catch(error => res.status(403).json({ error }));
          } else {
            const filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Post.deleteOne({ _id: req.params.id })
                .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                .then(console.log("Post supprimé avec succès"))
                .catch(error => res.status(403).json({ error }));
            })
          }
        }
      })
    .catch(error => res.status(403).json({ error }));
};

exports.deleteOnePostAdmin = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
        if ( req.admin.userId === adminId){
          if (post.imageUrl === undefined || post.imageUrl === null){
            Post.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .then(console.log("Post supprimé avec succès"))
            .catch(error => res.status(403).json({ error }));
          } else {
            const filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Post.deleteOne({ _id: req.params.id })
                .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                .then(console.log("Post supprimé avec succès"))
                .catch(error => res.status(403).json({ error }));
            })
          }
        } else {
          res.status(401).json({message : Non-autorisé})
        }
      })
    .catch(error => res.status(403).json({ error }));
};