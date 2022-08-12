const db = require('../db');
const { body, validationresult } = require('express-validator');

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

module.exports = { getAuthors, author_create, author_read, author_update, author_delete }