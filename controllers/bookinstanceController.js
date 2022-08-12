const db = require('../db');
const { body, validationresult } = require('express-validator');

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

module.exports = { getBookInstances, bookinstance_create, bookinstance_read, bookinstance_update, bookinstance_delete }