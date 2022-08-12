const db = require('../db');
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

module.exports = { getGenres, genre_create, genre_read, genre_update, genre_delete }