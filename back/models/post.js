const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: {type: String},
    date: {type: String},
    text: {type: String, required: true},
    imageUrl: {type: String},
    likes: {type: Number, min:0},
    usersLiked: {type: [String]}
});


module.exports = mongoose.model('Post', postSchema);