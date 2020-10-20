'use strict';
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const request = require("request-promise");

const app = express();
const router = express.Router();

router.get('/', async (req, res) => {
    const rawcity = req.query.kota;

    if (!rawcity) {
        return res.send("parameter kota tidak boleh kosong")
    }

    const city = rawcity
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");

    const link = 'https://bmkg-weather-api.netlify.app/data/weather.json';
    let weatherData = await request({ url: link, json: true })
    weatherData = weatherData.filter((element) => element.kota.includes(city));

    if (weatherData.length === 0) {
        return res.send("kota tidak ditemukan");
    }

    return res.json(weatherData[0]);
})

app.use(bodyParser.json());
app.use('/.netlify/functions/weather', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);