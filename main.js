const fs = require("fs");

let csv = [];

const COLUMNS = {
	"Asset": 0,
	"Payload": 1,
	"URLs": 2,
	"RequestCount": 3,
	"CPU": 4,
	"TotalTime": 5,
}

fs.readdir("input", (err, files) => {
	console.log(`Loading ${files.length} files...`)
	files.forEach(file => {
		let data = fs.readFileSync(`input/${file}`);
		data = JSON.parse(data.toString());
		const url = data.url;
		const RequestCount = data.pageviewsPerDay;
		data.assets.forEach(asset => {
			let entry = csv.find(a => a[COLUMNS["Asset"]] == asset.filename && a[COLUMNS["Payload"]] == asset.payloadBytes);
			if (!entry){
				entry = [
					asset.filename,
					asset.payloadBytes,
					[url],
					RequestCount,
					asset.CpuExecutionDuration * RequestCount,
					asset.downloadDuration * RequestCount,
				];
				csv.push(entry);
			} else {
				entry[COLUMNS["URLs"]].push(url);
				entry[COLUMNS["RequestCount"]] += RequestCount;
				entry[COLUMNS["CPU"]] += asset.CpuExecutionDuration * RequestCount;
				entry[COLUMNS["TotalTime"]] += asset.downloadDuration + asset.CpuExecutionDuration * RequestCount;
			}
		});
	});
	// Normalize time
	csv.forEach(entry => {
		entry[COLUMNS["CPU"]] = (entry[COLUMNS["CPU"]] / entry[COLUMNS["RequestCount"]]).toFixed(2);
	});
	// Sort list
	csv = csv.sort((a, b) => b[COLUMNS["TotalTime"]] - a[COLUMNS["TotalTime"]]);
	const headerText = Object.keys(COLUMNS).join(",") + "\n";
	const csvText = csv.reduce((acc, row) => {
		row[COLUMNS["URLs"]] = '"' + row[COLUMNS["URLs"]].join(",") + '"';
		return acc + row.join(",") + "\n";
	}, "");
	// Output csv
	fs.writeFileSync("output.csv", headerText + csvText);
	console.log("Output complete");
});
