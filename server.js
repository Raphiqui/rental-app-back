require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Successfully connected to', process.env.DATABASE_URL));

app.use(express.json());
app.use(cors());

const usersRouter = require('./routes/users.js');
app.use('/users', usersRouter);

const rentalsRouter = require('./routes/rentals.js');
app.use('/rentals', rentalsRouter);

app.listen(process.env.PORT, () => console.log("Server is listening on port", process.env.PORT));