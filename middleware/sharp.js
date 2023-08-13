const sharp = require('sharp');
const fs = require('fs');

module.exports = (req, res, next) => {
    if(!req.file){
        return next();
    }
    const imageBuffer = req.file.buffer;

    sharp(imageBuffer)
    .resize(460, 570)
    .toFormat('webp')
    .toBuffer()
    .then((outputBuffer) => {
        const fileName = req.file.originalname.split('.')[0] + Date.now();
        const path = `images/${fileName}.webp`;
        fs.writeFile(path, outputBuffer, (error) => {
            if(error){
                console.error(error)
            } else {
                req.file.path = path;
            }
            next()
        })
    })
    .catch(error => {
        console.error(error);
        next();
    })
}