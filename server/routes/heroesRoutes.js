const express = require('express');
const router = express.Router();
const heroesController = require('../controllers/heroesController');

/**
 * App Routes
 */
router.get('/', heroesController.homepage);
router.get('/heroes/:id', heroesController.exploreHeroes );
router.get('/categories', heroesController.exploreCategories);
router.get('/categories/:id', heroesController.exploreCategoriesById);
router.post('/search', heroesController.searchHeroes);
router.get('/explore-latest', heroesController.exploreLatest);
router.get('/explore-random', heroesController.exploreRandom);
router.get('/submit-heroes', heroesController.submitHeroes);
router.post('/submit-heroes', heroesController.submitHeroesOnPost);


module.exports = router;