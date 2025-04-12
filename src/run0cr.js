// src/runOcr.js

const Tesseract = require('tesseract.js');

function runOcr(file) {
    return new Promise((resolve, reject) => {
        Tesseract.recognize(
            file,
            'eng', // Language for OCR (English)
            {
                logger: function(m) {
                    console.log(m);
                }
            }
        ).then(function({ data: { text } }) {
            resolve(text);
        }).catch(function(error) {
            reject(error);
        });
    });
}

