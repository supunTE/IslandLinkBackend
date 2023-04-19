var express = require("express");
var router = express.Router();

async function getWeather(lat, long){
    return new Promise((resolve, reject) => {
        console.log(lat,long)
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.NODE_RAPID_API,
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };
    
    fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${lat}%2C${long}`, options)
        .then(response => response.json())
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
}

router.post("/", async function (req, res, next) {
    const lat = req.body.lat
    const long = req.body.long
    const weather = await getWeather(lat, long);
    if(!weather || !weather.current){
        res.status(500).send("No weather found");
        return;
    }
    const data = {
        temp: weather.current.temp_c,
        feelsLike: weather.current.feelslike_c,
        weather: weather.current.condition?.text,
        icon: 'https:' + weather.current.condition?.icon,
        location: weather.location.name + ', ' + weather.location.region
      }
      console.log(weather)
	res.send(data);
});

module.exports = router;