const express = require('express');
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const Bill = require('../models/bill');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('billing');
});

router.post('/', (req, res) => {
    //set the templatevariables
    const bill = new Bill(req.body.nameZb, req.body.fileNumber, req.body.identNr, req.body.workMin, req.body.fkCount, req.body.phoneCount, req.body.copyCount, req.body.porto);

    let doc = prepareTemplater();

    doc.setData(bill);

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
    } catch (error) {
        console.error("fehler");
    }

    let buffer = doc.getZip()
        .generate({
            type: 'nodebuffer'
        });

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve(__dirname, '../../billing/output/outputBill.docx'), buffer);
    res.send('Rechnung erfolgreich erstellt!');
});

function prepareTemplater() {
    //Load the docx file as a binary
    let content = fs
        .readFileSync(path.resolve(__dirname, '../../billing/templates/inputBill.docx'), 'binary');

    let zip = new JSZip(content);

    let doc = new Docxtemplater();
    doc.loadZip(zip);

    return doc;

}

module.exports = router;