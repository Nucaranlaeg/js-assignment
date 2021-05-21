# Web Performance Engineer - Take-home Assignment

A significant part of your job at SpeedSense will involve the aggregation and manipulation of test data from various tools. This data is often very high-resolution and specific, which can make prioritization challenging for development teams. A high-level overview is often a helpful place to start diagnosing performance issues.

Suppose that SpeedSense is performing a site speed audit on a fictional website. The site consists of 5 URLs, each of which recieves a different share of the site's overall traffic. A test script has scanned each of these URLs to determine: 

- Which assets are loaded on each page.
- The file sizes of each asset.
- The average time spent downloading each asset, per pageview
- The average time the client CPU spends parsing/executing the asset, per pageview

This information is then saved in a corresponding JSON file, per URL.

In this task, you will be taking the JSON output of this fictional performance audit, and generating a high-level overview of that test data in the form of a CSV spreadsheet.

Please write a Node.js script to read the JSON input files, aggregate the data therein, and generate the corresponding CSV output file.


## Input JSON

There are 5 JSON files to be used as input, one per URL tested. Each file contains the traffic allocation for that page for a day, as well as a list of assets which are downloaded and executed when this page loads. 

All times are in milliseconds.


## Output CSV

Your script should generate an output file in CSV format with the following columns:

- `Asset` 
    - Filename of the asset (e.g. `a.js`)
- `Payload` 
    - The file size of the asset.
- `URLs` 
    - List of URLs where this asset is loaded.
- `RequestCount` 
    - Total number of requests for this asset across all pageviews (assume there are no duplicate requests per pageview).
- `CPU` 
    - Average execution time across all pageviews.
- `TotalTime`
    - Total time spent (sum of download and CPU execution) across all pageviews

Sort the output by `TotalTime`.


## Documentation

Please provide at a minumum instructions on how to install dependencies and run the script via the command line; it does not need to be a standalone executable. (For example, `> node index.js` is sufficiently clear for running the script.) 

Submissions will be judged on a machine running the latest public version of macOS.

## Optional Bonus

Visualize this data in an interesting and digestible way.
