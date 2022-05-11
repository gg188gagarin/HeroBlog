const mongoose = require('mongoose');

const heroesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    description: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: 'This field is required.'
    },
    ingredients: {
        type: Array,
        required: 'This field is required.'
    },
    category: {
        type: String,
        enum: ['Thai', 'American', 'Chinese', 'Mexican', 'Indian'],
        required: 'This field is required.'
    },
    image: {
        type: String,
        required: 'This field is required.'
    },
});

heroesSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Heroes', heroesSchema);