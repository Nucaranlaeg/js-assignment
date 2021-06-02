const COLUMNS = {
	"Name": 0,
	"Payload": 1,
	"URLs": 2,
	"RequestCount": 3,
	"CPU": 4,
	"TotalTime": 5,
};

function parseCSV(csvText){
	// We know the format; don't need to fully handle CSVs.
	csv = csvText.split("\n");
	if (csvText[csvText.length - 1] == "\n") csv.pop();
	csv = csv.map(row => {
		if (row.includes('"')){
			row = row.split(/,?",?/);
			return row[0].split(",").concat([row[1].replace(/,/g, "\n")]).concat(row[2].split(","))
		}
		return row.split(",");
	});
	return csv;
}

byAsset = parseCSV(byAsset);
byType = parseCSV(byType);

// Could use Vue or Angular or other such library to do this.
// But it's not really more work to just do it in vanilla because we don't need reactivity.

function loadTable(tableRoot, tableData, colours){
	tableData.forEach((row, i) => {
		const rowNode = document.createElement("tr");
		const colNode = document.createElement("td");
		if (i) colNode.style.backgroundColor = colours[i - 1];
		rowNode.appendChild(colNode);
		row.forEach(col => {
			const colNode = document.createElement(i ? "td" : "th");
			if (col.includes("\n")){
				const divNode = document.createElement("div");
				divNode.innerText = col;
				colNode.appendChild(divNode);
			} else {
				colNode.innerText = col;
			}
			rowNode.appendChild(colNode);
		});
		tableRoot.appendChild(rowNode);
	});
}

function buildChart(chartContext, chartData, colours){
	chartData.shift();
	console.log("Building chart", chartContext)
	return new Chart(chartContext,
		{
			type: "pie",
			data: {
				labels: chartData.map(row => row[COLUMNS["Name"]]),
				datasets: [{
					data: chartData.map(row => row[COLUMNS["TotalTime"]]),
					backgroundColor: colours,
				}],
			}
		}
	);
}

var assetChart = null;
var typeChart = null;

// Delay loading until the page is loaded.
setTimeout(() => {
	const assetColours = Array(byAsset.length - 1).fill(0).map(_ => "#" + Math.floor(Math.random()*16777215).toString(16));
	const typeColours = Array(byType.length - 1).fill(0).map(_ => "#" + Math.floor(Math.random()*16777215).toString(16));
	loadTable(document.querySelector("#asset-table"), byAsset, assetColours);
	loadTable(document.querySelector("#type-table"), byType, typeColours);
	assetChart = buildChart(document.querySelector("#asset-chart"), byAsset, assetColours);
	typeChart = buildChart(document.querySelector("#type-chart").getContext("2d"), byType, typeColours);
});