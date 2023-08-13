const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const userRouter = require('./router/user');
const booksRouter = require('./router/books');

const app = express();

mongoose.connect('mongodb+srv://taollidev:idhgZwHJwxgJU5Cy@cluster0.1x3huop.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Conexion à MongoDB réussie !'))
.catch(error => console.log('Conexion à MongoDB echouée !'));

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRouter);
app.use('/api/books', booksRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app