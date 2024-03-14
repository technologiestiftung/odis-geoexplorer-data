"use strict";

const fs = require("fs");
var { getHtmlViaPuppeteer } = require("./utils/getHtmlViaPuppeteer");

function getFisBrokerDescription(mainCallback) {
  let ckanData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "data/ckan_data_filtered_attr.json"),
      "utf-8"
    )
  );

  async function run() {
    for (const item of ckanData) {
      const url = item.url;
      let fisBrokerData = "";

      try {
        if (
          item.url &&
          item.type === "WFS" &&
          url.includes("loginkey=alphaDataStart&alphaDataId")
        ) {
          fisBrokerData = await getHtmlViaPuppeteer(url);
          console.log("fisBrokerData: ", fisBrokerData);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        item.fisBroker = fisBrokerData ? fisBrokerData : [];
      } catch (error) {
        console.error("Error getting HTML info: ", error);
      }
    }

    fs.writeFile(
      "./data/ckan_data_filtered_attr_decr.json",
      JSON.stringify(ckanData),
      {
        encoding: "utf8",
      },
      (err) => {
        if (err) {
          console.error("Error writing file: ", err);
        } else {
          console.log("File written successfully");
        }
        mainCallback();
      }
    );
  }
  run();
}

module.exports = { getFisBrokerDescription };
