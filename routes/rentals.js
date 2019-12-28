const express = require('express');
const router = express.Router();
const Rental = require('../models/rental.js');
const _ = require('lodash');
const atob = require('atob');

getRental = async (req, res, next) => {
    let rental;

    try {
        rental = await Rental.findById(req.params.id);
        if(rental == null){
            return res.status(404).json({ message: 'Can\'t find rental'})
        }
    }catch (e) {
        return res.status(500).json({ message: e.message })
    }

    res.rental = rental;
    next()
};

getRentals = async (req, res, next) => {
    let rentals;
    const number = parseInt(req.params.token, 10);

    try {
        rentals = await Rental.aggregate( [ { $sample: { size: number } } ]);
        if(rentals == null){
            return res.status(404).json({ message: 'Can\'t find rentals'})
        }
    }catch (e) {
        return res.status(500).json({ message: e.message })
    }

    res.rentals = rentals;
    next()
};

router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find();
        res.json(rentals);
    }catch (e) {
        res.status(500).json({ message: e.message })
    }
});

router.get('/aggregate/:token', getRentals, (req, res) => {
    res.json(res.rentals)
});

//TODO: change response for a single image with atob
router.get('/image/:id', getRental, (req, res) => {
    try {

        const img = Buffer.from(res.rental.image.data, 'base64');
        res.send(img)
    }catch (e) {
        res.status(500).json({ message: e.message })
    }
});

router.get('/images/:id', getRental, (req, res) => {
    let pictures = [];
    try {
        _.map(res.rental.pictures, picture => {
            const img = Buffer.from(picture.data, 'base64');
            pictures.push(atob(img));
        });

        res.send(pictures)
    }catch (e) {
        res.status(500).json({ message: e.message })
    }
});

router.get('/:id', getRental, (req, res) => {
    res.json(res.rental)
});

router.post('/', async (req, res) => {

    const rental = new Rental({
        name: req.body.name,
        isAvailable: req.body.isAvailable,
        image: req.body.image,
        location: req.body.location,
        description: req.body.description,
        pictures: req.body.pictures,
    });
    try {
        const newRental = await rental.save();
        res.status(201).json(newRental)
    }catch (e) {
        res.status(400).json({ message: e.message })
    }
});

router.patch('/:id', getRental, async (req, res) => {

    if (req.body.name !== null) {res.rental.name = req.body.name;}
    if (req.body.isAvailable !== null) {res.rental.isAvailable = req.body.isAvailable;}
    if (req.body.image !== null) {res.rental.image = req.body.image;}
    if (req.body.location !== null) {res.rental.location = req.body.location;}
    if (req.body.description !== null) {res.rental.description = req.body.description;}
    if (req.body.pictures !== null) {res.rental.pictures = req.body.pictures;}

    try {
        const updatedRental = await res.rental.save();
        res.json(updatedRental)
    }catch (e) {
        res.status(400).json({ message: e.message })
    }
});

router.delete('/:id', getRental, async (req, res) => {
    try {
        await res.rental.remove();
        res.json({ message: 'Rental successfully deleted' })
    }catch (e) {
        res.status(500).json({ message: e.message })
    }
});

module.exports = router;