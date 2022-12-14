const User = require('../models/user');

// controller pour pouvoir afficher ou supprimer via PostMan

exports.getAllUsers = (req, res) => {
    User.find()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(404).json({ error }));
  };

  exports.getOneUser = (req, res) => {
    User.findOne({ _id: req.params.id })
      .then(user => res.status(200).json(user))
      .catch(error => res.status(400).json({ error }));
  };

  exports.deleteOneUser = (req, res) => {
    User.deleteOne({ _id: req.params.id })
      .then(user => res.status(200).json({ message: 'Utilisateur supprimé !' }))
      .then(console.log('Utilisateur supprimé avec succès !'))
      .catch(error => res.status(404).json({ error }));
  };