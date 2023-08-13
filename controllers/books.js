const Book = require('../models/book')
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(booksArr => {
        res.status(200).json(booksArr)
    })
    .catch(error => res.status(500).json({ error }))
};

exports.getBestRating = (req, res, next) => {
    Book.find()
    .sort({averageRating: -1})
    .limit(3)
    .then(bestRatings => res.status(200).json(bestRatings))
    .catch(error => res.status(500).json({ error }));
};

exports.postOneRating = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book.ratings.some(rating => rating.userId === req.auth.userId)){
            return res.status(403).json({ message: 'unauthorized request' })
        } else {
            const ratingObject = {
                userId : req.auth.userId,
                grade: req.body.rating,
            };
            const newRatings = [...book.ratings, ratingObject];
            const newAverageRating = newRatings.reduce((acc, rating) => acc += rating.grade, 0) / newRatings.length;
            const newBook = {
                ...book.toObject(),
                ratings: newRatings,
                averageRating : newAverageRating
            };
            Book.updateOne({_id: req.params.id}, newBook)
            .then(() => res.status(201).json(newBook))
            .catch(error => res.status(500).json({ error }))
        }
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        res.status(200).json(book)
    })
    .catch(error => res.status(500).json({ error }))
};

exports.postOneBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject.userId;
    delete bookObject._id;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`
    });
    book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(500).json({ error }));
};

exports.putOneBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`,
    } : {
        ...req.body
    };
    delete bookObject.userId;
    delete bookObject._id;

    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book.userId != req.auth.userId){
            return res.status(403).json({ message: 'unauthorized request' })
        } else {
            Book.updateOne({_id: req.params.id}, {
                ...bookObject,
                _id: req.params.id
            })
            .then(() => {
                if(req.file){
                    const filename = book.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (error) => {
                        if(error){
                            console.error('fs unlink err', {error})
                        }
                    })
                }
                res.status(201).json({message: 'objet modifié !'})
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }))
}

exports.deleteOneBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book.userId != req.auth.userId){
            res.status(403).json({message: 'unauthorized request'})
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: 'Livre supprimé !'}))
                .catch(error => res.status(401).json({ error }))
            })
        }
    })
    .catch(error => res.status(500).json({ error }))
}