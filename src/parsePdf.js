// src/parsePdf.js

const pdfjsLib = require('pdfjs-dist');

function parsePdf(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const pdfData = new Uint8Array(e.target.result);

        pdfjsLib.getDocument(pdfData).promise.then(function(pdf) {
            let text = '';
            const numPages = pdf.numPages;

            // Loop through all pages to extract text
            for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                pdf.getPage(pageNumber).then(function(page) {
                    page.getTextContent().then(function(textContent) {
                        text += textContent.items.map(item => item.str).join(' ') + '\n';
                    });
                });
            }

            return text;
        }).catch(function(error) {
            console.error(error);
            alert('Error parsing PDF.');
        });
    };

    reader.readAsArrayBuffer(file);
}

