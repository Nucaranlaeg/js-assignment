const fs = require("fs");

let csv = [];

const COLUMNS = {
	"Asset": 0,
	"Payload": 1,
	"URLs": 2,
	"RequestCount": 3,
	"CPU": 4,
	"TotalTime": 5,
};

let aggregates = [];

const AGGREGATE_COLS = {
	"Type": 0,
	"AvgPayload": 1,
	"URLs": 2,
	"RequestCount": 3,
	"CPU": 4,
	"TotalTime": 5,
};

fs.readdir("input", (err, files) => {
	console.log(`Loading ${files.length} files...`);
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
			// Sum per asset type
			let asset_type = asset.filename.split(".").pop();
			entry = aggregates.find(a => a[AGGREGATE_COLS["Type"]] == asset_type);
			if (!entry){
				entry = [
					asset_type,
					asset.payloadBytes,
					new Set([url]),
					RequestCount,
					asset.CpuExecutionDuration * RequestCount,
					asset.downloadDuration * RequestCount,
				];
				aggregates.push(entry);
			} else {
				entry[AGGREGATE_COLS["AvgPayload"]] += asset.payloadBytes * RequestCount;
				entry[AGGREGATE_COLS["URLs"]].add(url);
				entry[AGGREGATE_COLS["RequestCount"]] += RequestCount;
				entry[AGGREGATE_COLS["CPU"]] += asset.CpuExecutionDuration * RequestCount;
				entry[AGGREGATE_COLS["TotalTime"]] += asset.downloadDuration + asset.CpuExecutionDuration * RequestCount;
			}
		});
	});
	// Normalize time
	csv.forEach(entry => {
		entry[COLUMNS["CPU"]] = (entry[COLUMNS["CPU"]] / entry[COLUMNS["RequestCount"]]).toFixed(2);
	});
	aggregates.forEach(entry => {
		entry[AGGREGATE_COLS["AvgPayload"]] = (entry[AGGREGATE_COLS["AvgPayload"]] / entry[AGGREGATE_COLS["RequestCount"]]).toFixed(2);
		entry[AGGREGATE_COLS["CPU"]] = (entry[AGGREGATE_COLS["CPU"]] / entry[AGGREGATE_COLS["RequestCount"]]).toFixed(2);
	});
	// Sort list
	csv = csv.sort((a, b) => b[COLUMNS["TotalTime"]] - a[COLUMNS["TotalTime"]]);
	const headerText = Object.keys(COLUMNS).join(",") + "\n";
	const csvText = csv.reduce((acc, row) => {
		row[COLUMNS["URLs"]] = '"' + row[COLUMNS["URLs"]].join(",") + '"';
		return acc + row.join(",") + "\n";
	}, "");
	aggregates = aggregates.sort((a, b) => b[AGGREGATE_COLS["TotalTime"]] - a[AGGREGATE_COLS["TotalTime"]]);
	const headerText2 = Object.keys(AGGREGATE_COLS).join(",") + "\n";
	const aggregateText = aggregates.reduce((acc, row) => {
		row[AGGREGATE_COLS["URLs"]] = '"' + [...row[AGGREGATE_COLS["URLs"]]].join(",") + '"';
		return acc + row.join(",") + "\n";
	}, "");
	
	// Output csvs as js files so I don't have to run a local server.
	fs.writeFileSync("output.js", "let byAsset = `" + headerText + csvText + "`");
	fs.writeFileSync("aggregateoutput.js", "let byType = `" + headerText2 + aggregateText + "`");
	console.log("Output complete");
});
