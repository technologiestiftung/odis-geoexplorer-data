"use strict";

const fs = require("fs");
var { getHtmlViaPuppeteer } = require("./utils/getHtmlViaPuppeteer");

function getFisBrokerDescription(mainCallback) {
  let listDatasets = JSON.parse(fs.readFileSync(LIST_DATASETS));

  async function run() {
    for (const datasetName of listDatasets) {
      let datasetInfo = JSON.parse(
        fs.readFileSync(`./scraper/data/datasets/${datasetName}/ckan.json`)
      );
      console.log("getting info for: ", datasetName);

      const url = datasetInfo.url;
      let fisBrokerData = "";

      try {
        if (
          // only data from fisbroker
          url &&
          datasetInfo.type === "WFS" &&
          url.includes("loginkey=alphaDataStart&alphaDataId")
        ) {
          fisBrokerData = await getHtmlViaPuppeteer(url);
          console.log("fisBrokerData: ", fisBrokerData);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        fs.writeFileSync(
          `./scraper/data/datasets/${datasetName}/attributesDescription.json`,
          JSON.stringify(fisBrokerData ? fisBrokerData : [])
        );
      } catch (error) {
        console.error("Error getting HTML info: ", error);
      }
    }

    mainCallback();
  }
  run();
}

module.exports = { getFisBrokerDescription };
