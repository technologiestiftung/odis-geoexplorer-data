"use strict";
const fs = require("fs");

var { getHtmlAsMarkdown } = require("./utils/getHtmlAsMarkdown");

function getHtmlInfo(mainCallback) {
  let ckanData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "data/ckan_data_filtered_attr_decr.json"),
      "utf-8"
    )
  );

  async function run() {
    for (const item of ckanData) {
      const url = item.techHtml;
      let htmlData = "";

      try {
        if (url) {
          htmlData = await getHtmlAsMarkdown(url);
          console.log("htmlData: ", htmlData);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        item.htmlData = htmlData ? htmlData : [];
      } catch (error) {
        console.error("Error getting HTML info: ", error);
      }
    }

    fs.writeFile(
      "./data/ckan_data_filtered_attr_decr_html.json",
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

module.exports = { getHtmlInfo };
