const {Router, response} = require('express');
const route = Router();
const fetch = require('cross-fetch');


route.get("/:keyword", (req, res) => {
    const path = req.params.path;
    fetch(
        'https://dog.ceo/api/breeds/image/random',
          {
            method: 'GET',
            compress: true,
            headers: new fetch.Headers({ Accept: 'application/json' }),
          }
        ).then(response=>{
            if (response.ok) {
                response.json().then(data=>{
                    res.json(data);
                })                
            } else {
                res.status(404).send('Not found');
            }
        }).catch(e=>{
            res.status(404).send('Not found');
        })

})


module.exports = route;