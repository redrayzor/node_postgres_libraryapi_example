const db = require('../db');
const { body, validationresult } = require('express-validator');

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

module.exports = { getBooks, book_create, book_read, book_update, book_delete }