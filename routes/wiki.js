var { Scraper, Root, DownloadContent, OpenLinks, CollectContent } = require("nodejs-web-scraper");
var express = require("express");
const cheerio = require("cheerio");
var router = express.Router();

async function getWikiData(city) {
	var config = {
		baseSiteUrl: `https://en.wikipedia.org/wiki/${city}`,
		startUrl: `https://en.wikipedia.org/wiki/${city}`,
		filePath: "./images/",
		concurrency: 10,
		maxRetries: 3,
		logPath: "./logs/",
	};
	var scraper = new Scraper(config);
	var root = new Root();

	var title = new CollectContent("h1#firstHeading span");
	var imagePage = new OpenLinks(".sidebar a.image");
	var fullImageHtmlContent = new CollectContent(".fullImageLink", { contentType: "html" });

	root.addOperation(title);
	root.addOperation(imagePage);
	imagePage.addOperation(fullImageHtmlContent);

	await scraper.scrape(root);

	var pageTitle = title.getData();
	var pageImageHTMLContent = fullImageHtmlContent.getData();
	let href = "";

	try {
		const $ = cheerio.load(pageImageHTMLContent[0]);
		href = "https:" + $("a").attr("href");
	} catch (err) {
		console.log(err);
		return null;
	}

	var data = {
		title: pageTitle,
		href: href,
	};
	return data;
}

router.get("/", async function (req, res, next) {
	const data = await getWikiData("Colombo");
	if (!data) {
		res.status(500).send("Error");
		return;
	}
	res.send(data);
});

module.exports = router;
