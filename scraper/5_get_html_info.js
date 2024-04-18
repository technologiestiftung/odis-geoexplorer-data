"use strict";

const fs = require("fs");
var { getHtmlAsMarkdown } = require("./utils/getHtmlAsMarkdown");

function getHtmlInfo(mainCallback) {
  let listDatasets = JSON.parse(fs.readFileSync(LIST_DATASETS));

  async function run() {
    for (const datasetName of listDatasets) {
      let datasetInfo = JSON.parse(
        fs.readFileSync(`./scraper/data/datasets/${datasetName}/ckan.json`)
      );

      const url = datasetInfo.techHtml;

      try {
        if (url) {
          let htmlData = await getHtmlAsMarkdown(url);

          await new Promise((resolve) => setTimeout(resolve, 500));
          if (!htmlData.includes('Startseite von "Umweltatlas Berlin"')) {
            fs.writeFileSync(
              `./scarper/data/datasets/${datasetName}/htmlDescription.json`,
              JSON.stringify(htmlData ? htmlData : [])
            );
          }
        }
      } catch (error) {
        console.error("Error getting HTML info: ", error);
      }
    }

    mainCallback();
  }
  run();
}

module.exports = { getHtmlInfo };
