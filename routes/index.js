const express = require('express');
const router = express.Router();

const genreController = require('../controllers/genreController');
const authorController = require('../controllers/authorController');
const bookController = require('../controllers/bookController');
const bookinstanceController = require('../controllers/bookinstanceController');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: "Raymond's Express Postgres library example" });
});

router.get('/genres', genreController.getGenres);
router.post('/genre/create', genreController.genre_create);
router.get('/genre/:id', genreController.genre_read);
router.put('/genre/:id', genreController.genre_update);
router.delete('/genre/:id', genreController.genre_delete);

router.get('/authors', authorController.getAuthors);
router.post('/author/create', authorController.author_create);
router.get('/author/:id', authorController.author_read);
router.put('/author/:id', authorController.author_update);
router.delete('/author/:id', authorController.author_delete);

router.get('/books', bookController.getBooks);
router.post('/book/create', bookController.book_create);
router.get('/book/:id', bookController.book_read);
router.put('/book/:id', bookController.book_update);
router.delete('/book/:id', bookController.book_delete);

router.get('/bookinstances', bookinstanceController.getBookInstances);
router.post('/bookinstance/create', bookinstanceController.bookinstance_create);
router.get('/bookinstance/:id', bookinstanceController.bookinstance_read);
router.put('/bookinstance/:id', bookinstanceController.bookinstance_update);
router.delete('/bookinstance/:id', bookinstanceController.bookinstance_delete);

module.exports = router;
