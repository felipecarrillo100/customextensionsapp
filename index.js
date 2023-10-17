const path = require('path')
const express = require('express');
const cors = require('cors');

const integrityRouter = require('./routes/integrity');
const imagesRouter = require('./routes/getimages');
const catalogRouter = require('./routes/catalogservice');


const PORT = 5000;

const app = express()
app.use(cors());

app.use("/api/integrity", integrityRouter);
app.use("/api/images", imagesRouter);
app.use("/api/catalog", catalogRouter);

app.use('/', express.static(path.join(__dirname, 'public')))

app.listen(PORT, ()=>{
    console.log(`App Listening to port ${PORT}`)
});