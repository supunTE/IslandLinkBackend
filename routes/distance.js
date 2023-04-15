var express = require("express");
var router = express.Router();

function getDistance(source, destination) {
	return new Promise((resolve, reject) => {
		const endpoint = "https://api.openrouteservice.org/v2/matrix/driving-car";
		// const endpoint = "";
		const apiKey = process.env.NODE_OPEN_ROUTE;
		const url = `${endpoint}?api_key=${apiKey}`;

		const body = {
			locations: [source, destination],
			metrics: ["distance"],
			units: "km",
			destinations: [1],
			sources: [0],
		};

		// Send API request
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: apiKey,
			},
			body: JSON.stringify(body),
		})
			.then((response) => response.json())
			.then((data) => {
				const distance = data?.distances?.[0]?.[0];
				if (!distance) {
					reject("No distance found");
				}
				resolve(distance);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

router.post("/", async function (req, res, next) {
	const source = [req.body.sourceLong, req.body.sourceLat];
	const destination = [req.body.destLong, req.body.destLat];
	console.log(source, destination);

	try {
		const distance = await getDistance(source, destination);
		console.log("dis:", distance);
		const response = {
			distance,
		};
		res.send(response);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

module.exports = router;
