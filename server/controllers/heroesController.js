require('../models/database');
const Category = require('../models/Category');
const Heroes = require('../models/Heroes');

/**
 * GET /
 * Homepage
 */
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Heroes.find({}).sort({_id: -1}).limit(limitNumber);
    const dc = await Heroes.find({ 'category': 'DC' }).limit(limitNumber);
    const marvel = await Heroes.find({ 'category': 'Marvel' }).limit(limitNumber);
    const anime = await Heroes.find({ 'category': 'Anime' }).limit(limitNumber);

    const skill = { latest, dc, marvel, anime };

    res.render('index', { title: 'Heroes Blog - Home', categories, skill } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Heroes Blog - Categoreis', categories } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async(req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Heroes.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Heroes Blog - Categoreis', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /heroes/:id
 * Heroes
 */
exports.exploreHeroes = async(req, res) => {
  try {
    let heroesId = req.params.id;
    const heroes = await Heroes.findById(heroesId);
    res.render('heroes', { title: 'Heroes Blog - Heroes', heroes } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * POST /search
 * Search
 */
exports.searchHeroes = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let heroes = await Heroes.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Heroes Blog - Search', heroes } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }

}

/**
 * GET /explore-latest
 * Explplore Latest
 */
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const heroes = await Heroes.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Heroes Blog - Explore Latest', heroes } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}



/**
 * GET /explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Heroes.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let heroes = await Heroes.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Heroes Blog - Explore Latest', heroes } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * GET /submit-heroes
 * Submit Heroes
 */
exports.submitHeroes = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-heroes', { title: 'Heroes Blog - Submit Heroes', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-heroes
 * Submit Heroes
 */
exports.submitHeroesOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newHeroes = new Heroes({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });

    await newHeroes.save();

    req.flash('infoSubmit', 'Heroes has been added.')
    res.redirect('/submit-Heroes');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-heroes');
  }
}

// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();

// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Heroes.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


