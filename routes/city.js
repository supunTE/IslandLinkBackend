var express = require("express");
var router = express.Router();

function getUserLocation(lat, long) {
	return new Promise((resolve, reject) => {
		const endpoint = "https://api.openrouteservice.org/geocode/reverse";
		// const endpoint = "";
		const apiKey = process.env.NODE_OPEN_ROUTE;
		const url = `${endpoint}?api_key=${apiKey}&point.lon=${long}&point.lat=${lat}&boundary.country=LK`;

		// Send API request
		fetch(url)
			.then((response) => response.json())
			.then((result) => {
				const cityName = result?.features[0]?.properties?.county;
				if (!cityName) {
					reject("No city found");
				}
				resolve(cityName);
			})
			.catch((error) => reject(error));
	});
}

router.post("/", async function (req, res, next) {
	const lat = req.body.lat;
	const long = req.body.long;

	try {
		const city = await getUserLocation(lat, long);
		const response = {
			city,
		};
		res.send(response);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

module.exports = router;
