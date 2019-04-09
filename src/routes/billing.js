const express = require('express');
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const mammoth = require('mammoth');
const Bill = require('../models/bill');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.use('/', (req, res, next) => {
    if (req.app.locals.user.name === 'huel' || req.app.locals.user.name === 'gabi') {
        next();
    } else {
        res.redirect('/');
    }
});

router.get('/', (req, res) => {
    console.log('billing');
    res.render('billing');
});

router.post('/', (req, res) => {
    //set the templatevariables
    console.log('post an /billing');
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
    fs.writeFileSync(path.resolve(__dirname, '../../billingres/output/outputBill.docx'), buffer);
    res.redirect('/billing/output');
});

router.get('/output', async (req, res) => {
    console.log('/billing/output');
    const result = await mammoth.convertToHtml({
        path: path.join(__dirname, '../../billingres/output/outputBill.docx')
    });
    if (!result) {
        console.error('fehler beim parsen');
    }
    res.locals.bill = result.value;
    res.render('bill-output');
});

router.get('/download', (req, res) => {
    const filePath = path.join(__dirname, '../../billingres/output/outputBill.docx');
    const fileName = 'rechnung.docx';
    res.download(filePath, fileName);
});

function prepareTemplater() {
    //Load the docx file as a binary
    let content = fs
        .readFileSync(path.resolve(__dirname, '../../billingres/templates/inputBill.docx'), 'binary');

    let zip = new JSZip(content);

    let doc = new Docxtemplater();
    doc.loadZip(zip);

    return doc;

}

module.exports = router;