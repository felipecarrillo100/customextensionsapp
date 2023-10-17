const {Router} = require('express');
const route = Router();
const {getIntegrityCode} = require("../modules/integrityCode.js");


route.get("/:path/:filename", (req, res) => {
    const path = req.params.path;
    const filename = req.params.filename;
    try{
        const code = getIntegrityCode(`./public/${path}/${filename}`);
        res.send(`${code}`);
    } catch(e) {
        res.status(404).send('Not found');
    }
})


module.exports = route;