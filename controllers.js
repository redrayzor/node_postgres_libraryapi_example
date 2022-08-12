const db = require('./db');
const { body, validationresult } = require('express-validator');

async function getGenres(req, res) {
    const genres = await db.Genre.findAll();
    res.status(200).json(genres);
};

genre_create = [body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    (req, res) => { async function temp() {
        try {
            const genre = await db.Genre.create(req.body);
            res.status(201).json(genre);
        } catch(err) {
            res.status(400).send(err);
        }
    };
    temp();
}];

async function genre_read(req, res) {
    const genre = await db.Genre.findByPk(req.params.id, {include: db.Book});
    if (genre===null) {
        res.sendStatus(404).end();
    } else {
        res.status(200).json(genre);
    }
}

genre_update = [body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    (req, res) => { async function temp() {
        try {
            const id = req.params.id;
            if (req.body.id === id) {
                await db.Genre.update(req.body, { where: {id: id} });
                res.status(302).redirect(`/genre/${id}`);
            } else {
                res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
            }
        } catch(err) {
            res.status(400).send(err);
        }
    };
    temp();
}];

async function genre_delete(req, res) {
    try {
        await db.Genre.destroy({ where: {id: req.params.id} });
        res.sendStatus(200).end();
    } catch(err) {
        res.status(400).send(err);
    }
}

async function getAuthors(req, res) {
    const authors = await db.Author.findAll();
    res.status(200).json(authors);
};

author_create = [
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),
    (req, res) => { async function temp() {
        try {
            const author = await db.Author.create(req.body);
            res.status(201).json(author);
        } catch(err) {
            res.status(400).send(err);
        }
    };
    temp();
}];

async function author_read(req, res) {
    const author = await db.Author.findByPk(req.params.id, {include: db.Book});
    if (author===null) {
        res.sendStatus(404).end();
    } else {
        res.status(200).json(author);
    }
}

author_update = [
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),
    (req, res) => { async function temp() {
        try {
            const id = req.params.id;
            if (req.body.id === id) {
                await db.Author.update(req.body, { where: {id: id} });
                res.status(302).redirect(`/author/${id}`);
            } else {
                res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
            }
        } catch(err) {
            res.status(400).send(err);
        }
    };
    temp();
}];

async function author_delete(req, res) {
    try {
        await db.Author.destroy({ where: {id: req.params.id} });
        res.sendStatus(200).end();
    } catch(err) {
        res.status(400).send(err);
    }
}

async function getBooks(req, res) {
    const books = await db.Book.findAll();
    res.status(200).json(books);
}

book_create = [
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    (req, res) => { async function temp() {
        const t = await db.sequelize.transaction();
        try {
            const genres = req.body.GenreIds;
            const book = await db.Book.create(req.body, {transaction: t});
            await book.addGenres(genres, {transaction: t});
            await t.commit();
            res.status(201).json(book);
        } catch(err) {
            await t.rollback();
            res.status(400).send(err);
        }
    };
    temp();
}];

async function book_read(req, res) {
    const book = await db.Book.findByPk(req.params.id, {include: [db.Author, db.Genre, db.BookInstance]});
    if (book === null) {
        res.sendStatus(404).end();
    } else {
        res.status(200).json(book);
    }
}

book_update = [
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    (req, res) => { async function temp() {
        const t = await db.sequelize.transaction();
        try {
            const id = req.params.id;
            if (req.body.id !== id) {
                throw(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
            }
            const genres = req.body.GenreIds;
            await db.Book.update(req.body, { where: {id: id} }, {transaction: t});
            const book = await db.Book.findByPk(req.params.id);
            await book.setGenres(genres, {transaction: t});
            await t.commit();
            res.status(302).redirect(`/book/${id}`);
        } catch(err) {
            await t.rollback();
            res.status(400).send(err);
        }
    };
    temp();
}];

async function book_delete(req, res) {
    try {
        await db.Book.destroy({ where: {id: req.params.id} });
        res.sendStatus(200).end();
    } catch(err) {
        res.status(400).send(err);
    }
}

async function getBookInstances(req, res) {
    const bookinstances = await db.BookInstance.findAll();
    res.status(200).json(bookinstances);
}

bookinstance_create = [
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
    (req, res) => { async function temp() {
        try {
            const bookinstance = await db.BookInstance.create(req.body);
            res.status(201).json(bookinstance);
        } catch(err) {
            res.status(400).send(err);
        }
    };
    temp();
}];

async function bookinstance_read(req, res) {
    const bookinstance = await db.BookInstance.findByPk(req.params.id, {include: db.Book});
    if (bookinstance === null) {
        res.sendStatus(404).end();
    } else {
        res.status(200).json(bookinstance);
    }
}

bookinstance_update = [
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
    (req, res) => { async function temp() {
        try {
            const id = req.params.id;
            if (req.body.id === id) {
                await db.BookInstance.update(req.body, { where: {id: id} });
                res.status(302).redirect(`/bookinstance/${id}`);
            } else {
                res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
            }
        } catch(err) {
            res.status(400).send(err);
        }
    };
    temp();
}];

async function bookinstance_delete(req, res) {
    try {
        await db.BookInstance.destroy({ where: {id: req.params.id} });
        res.sendStatus(200).end();
    } catch(err) {
        res.status(400).send(err);
    }
}

module.exports = {
    getGenres, genre_create, genre_read, genre_update, genre_delete,
    getAuthors, author_create, author_read, author_update, author_delete,
    getBooks, book_create, book_read, book_update, book_delete,
    getBookInstances, bookinstance_create, bookinstance_read, bookinstance_update, bookinstance_delete }