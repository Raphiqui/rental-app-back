const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

getUser = async (req, res, next) => {
    let user;

    try {
        user = await User.findById(req.params.id);
        if(user == null){
            return res.status(404).json({ message: 'Can\'t find user'})
        }
    }catch (e) {
        return res.status(500).json({ message: e.message })
    }

    res.user = user;
    next()
};

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }catch (e) {
        res.status(500).json({ message: e.message })
    }
});

router.get('/:id', getUser, (req, res) => {
    res.json(res.user)
});

router.post('/', async (req, res) => {

    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        birth_date: req.body.birth_date,
        address: req.body.address,
        phone_number: req.body.phone_number,
        login: req.body.login,
        password: await bcrypt.hash(req.body.password, 5)
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser)
    }catch (e) {
        res.status(400).json({ message: e.message })
    }
});

router.patch('/:id', getUser, async (req, res) => {

    if (req.body.name !== null) {res.user.name = req.body.name;}
    if (req.body.surname !== null) {res.user.surname = req.body.surname;}
    if (req.body.birth_date !== null) {res.user.age = req.body.birth_date;}
    if (req.body.address !== null) {res.user.address = req.body.address;}
    if (req.body.login !== null) {res.user.login = req.body.login;}
    if (req.body.password !== null) {res.user.password = req.body.password;}

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser)
    }catch (e) {
        res.status(400).json({ message: e.message })
    }
});

router.patch('/changePassword/:id', getUser, async (req, res) => {

    let user;

    try {
        user = await User.findOne({login: req.body.login});

        if(user === null || await bcrypt.compare(req.body.oldPassword, user.password) !== true){
            res.status(404).json("Login or password invalid")
        }else {
            res.user.password = await bcrypt.hash(req.body.newPassword, 5);
            try {
                const updatedUserPassword = await res.user.save();
                res.json(updatedUserPassword)
            }catch (e) {
                res.status(400).json({ message: e.message })
            }
        }

    }catch (e) {
        res.status(500).json({ message: e.message })
    }
});

router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: 'User successfully deleted' })
    }catch (e) {
        res.status(500).json({ message: e.message })
    }
});

router.post('/login', async (req, res) => {

    let user;

    try {
        user = await User.findOne({login: req.body.login});
        if(user === null || await bcrypt.compare(req.body.password, user.password) !== true){
            res.status(404).json("Login or password invalid")
        }else {
            res.json(user);
        }

    }catch (e) {
        res.status(500).json({ message: e.message })
    }
});

module.exports = router;